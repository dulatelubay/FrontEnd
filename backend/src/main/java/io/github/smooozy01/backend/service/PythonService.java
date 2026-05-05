package io.github.smooozy01.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.smooozy01.backend.dto.response.SandboxResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class PythonService {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Value("${sandbox.image:trainer-sandbox}")
    private String sandboxImage;

    // Wrapper script: captures stdout, collects matplotlib figures, emits JSON
    private static final String WRAPPER = """
            import sys, io, json, base64 as _b64, traceback as _tb, os
            _figs = []
            _err = None
            _raw = _b64.b64decode(os.environ['STUDENT_CODE']).decode('utf-8')
            _cap = io.StringIO()
            _old = sys.stdout
            sys.stdout = _cap
            try:
                exec(compile(_raw, '<student>', 'exec'), {'__name__': '__main__'})
            except SystemExit:
                pass
            except Exception:
                _err = _tb.format_exc()
            finally:
                sys.stdout = _old
            try:
                import matplotlib.pyplot as _plt
                for _i in _plt.get_fignums():
                    _fb = io.BytesIO()
                    _plt.figure(_i).savefig(_fb, format='png', bbox_inches='tight', dpi=100)
                    _fb.seek(0)
                    _figs.append(_b64.b64encode(_fb.read()).decode('ascii'))
                _plt.close('all')
            except ImportError:
                pass
            print(json.dumps({"output": _cap.getvalue(), "figures": _figs, "error": _err}))
            """;

    public SandboxResponse runCode(String pythonCode) throws Exception {
        String encodedCode = Base64.getEncoder().encodeToString(pythonCode.getBytes());

        ProcessBuilder pb = new ProcessBuilder(
                "docker", "run",
                "--rm",
                "-i",
                "--network", "none",
                "--memory", "256m",
                "--cpus", "0.5",
                "--pids-limit", "20",
                "--read-only",
                "--tmpfs", "/tmp",
                "-e", "MPLBACKEND=Agg",
                "-e", "MPLCONFIGDIR=/tmp",
                "-e", "STUDENT_CODE=" + encodedCode,
                sandboxImage,
                "python", "-"
        );
        pb.redirectErrorStream(false);

        Process process = pb.start();
        process.getOutputStream().write(WRAPPER.getBytes());
        process.getOutputStream().close();

        // Read both streams concurrently to avoid pipe deadlock
        var outBuf = new StringBuilder();
        var errBuf = new StringBuilder();
        Thread outThread = new Thread(() -> {
            try { outBuf.append(new String(process.getInputStream().readAllBytes())); }
            catch (IOException ignored) {}
        });
        Thread errThread = new Thread(() -> {
            try { errBuf.append(new String(process.getErrorStream().readAllBytes())); }
            catch (IOException ignored) {}
        });
        outThread.start();
        errThread.start();

        boolean finished = process.waitFor(15, TimeUnit.SECONDS);
        outThread.join(2000);
        errThread.join(2000);
        String stdout = outBuf.toString();
        String stderr = errBuf.toString();

        if (!finished) {
            process.destroyForcibly();
            return new SandboxResponse("", Collections.emptyList(), "Error: Code execution timed out (15s limit)");
        }

        if (stdout.isBlank()) {
            String msg = stderr.isBlank() ? "Error: no output from sandbox" : stderr;
            return new SandboxResponse("", Collections.emptyList(), msg);
        }

        try {
            JsonNode node = MAPPER.readTree(stdout.strip());
            String output = node.path("output").asText("");
            String error = node.path("error").isNull() ? null : node.path("error").asText(null);
            List<String> figures = MAPPER.convertValue(
                    node.path("figures"),
                    MAPPER.getTypeFactory().constructCollectionType(List.class, String.class)
            );
            return new SandboxResponse(output, figures, error);
        } catch (Exception e) {
            return new SandboxResponse(stdout, Collections.emptyList(), stderr.isBlank() ? null : stderr);
        }
    }
}
