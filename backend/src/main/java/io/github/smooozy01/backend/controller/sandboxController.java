package io.github.smooozy01.backend.controller;
import io.github.smooozy01.backend.dto.response.SandboxResponse;
import io.github.smooozy01.backend.service.PythonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("sandbox")
@RequiredArgsConstructor
public class sandboxController {

    private final PythonService pythonService;

    @PostMapping("execute-code")
    public ResponseEntity<SandboxResponse> executeCode(@RequestBody String code) {
        try {
            return ResponseEntity.ok(pythonService.runCode(code));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new SandboxResponse("", Collections.emptyList(), "Error: " + e.getMessage()));
        }
    }

}
