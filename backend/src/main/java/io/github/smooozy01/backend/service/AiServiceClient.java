package io.github.smooozy01.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.smooozy01.backend.dto.response.SandboxResponse;
import io.github.smooozy01.backend.entity.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    @Value("${ai.service.url:http://localhost:8100}")
    private String baseUrl;

    public record AiGradeResult(int grade, String feedback) {}

    public AiGradeResult grade(Task task, String code, SandboxResponse sandbox) {
        try {
            Map<String, Object> execResult = new HashMap<>();
            execResult.put("output", sandbox.output() != null ? truncate(sandbox.output(), 2000) : "");
            execResult.put("error", sandbox.error());

            Map<String, Object> body = new HashMap<>();
            body.put("teacher_id", "system");
            body.put("task_id", String.valueOf(task.getId()));
            body.put("task_description", task.getDescription() != null ? task.getDescription() : "");
            body.put("expected_approach", task.getSolution() != null ? task.getSolution() : "No expected solution provided.");
            body.put("submitted_code", code);
            body.put("execution_result", execResult);
            body.put("vl_level", "intermediate");

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/v1/grade"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(MAPPER.writeValueAsString(body)))
                    .build();

            HttpResponse<String> res = HTTP.send(req, HttpResponse.BodyHandlers.ofString());

            if (res.statusCode() != 200) {
                log.warn("AI service returned {}: {}", res.statusCode(), res.body());
                return null;
            }

            JsonNode node = MAPPER.readTree(res.body());
            int grade = (int) Math.round(node.path("score").asDouble(0.5) * 100);

            StringBuilder fb = new StringBuilder(node.path("feedback").asText(""));

            JsonNode issues = node.path("code_issues");
            if (issues.isArray() && issues.size() > 0) {
                fb.append("\n\nПроблемы в коде:");
                issues.forEach(i -> fb.append("\n• ").append(i.asText()));
            }

            JsonNode recs = node.path("recommendations");
            if (recs.isArray() && recs.size() > 0) {
                fb.append("\n\nРекомендации:");
                recs.forEach(r -> fb.append("\n• ").append(r.asText()));
            }

            return new AiGradeResult(grade, fb.toString());
        } catch (Exception e) {
            log.warn("AI grading failed [{}]: {}", e.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }

    public record AiHintResult(String hint, String nextAction) {}

    public AiHintResult hint(Task task, Long studentId, String currentCode) {
        try {
            Map<String, Object> context = new HashMap<>();
            context.put("scenario_name", task.getTitle() != null ? task.getTitle() : "Задание по анализу данных");
            context.put("available_data", java.util.List.of("pandas", "numpy", "matplotlib", "seaborn", "Python 3.12"));
            context.put("objective", task.getDescription() != null ? task.getDescription() : "");

            Map<String, Object> body = new HashMap<>();
            body.put("teacher_id", String.valueOf(studentId));
            body.put("scenario_id", String.valueOf(task.getId()));
            body.put("current_step", "data_analysis_task");
            body.put("teacher_action", currentCode != null && !currentCode.isBlank()
                    ? "Студент написал код:\n" + truncate(currentCode, 1000)
                    : "Студент читает условие задания и ещё не написал код");
            body.put("vl_level", "intermediate");
            body.put("context", context);

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/api/v1/scaffold"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(MAPPER.writeValueAsString(body)))
                    .build();

            HttpResponse<String> res = HTTP.send(req, HttpResponse.BodyHandlers.ofString());

            if (res.statusCode() != 200) {
                log.warn("AI hint service returned {}: {}", res.statusCode(), res.body());
                return null;
            }

            JsonNode node = MAPPER.readTree(res.body());
            return new AiHintResult(
                    node.path("hint").asText(""),
                    node.path("next_suggested_action").asText("")
            );
        } catch (Exception e) {
            log.warn("AI hint failed [{}]: {}", e.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }

    private static String truncate(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max) + "...(truncated)";
    }
}
