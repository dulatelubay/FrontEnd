package io.github.smooozy01.backend.controller;

import io.github.smooozy01.backend.entity.Task;
import io.github.smooozy01.backend.repository.TaskRepository;
import io.github.smooozy01.backend.service.AiServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/hints")
@RequiredArgsConstructor
public class HintController {

    private final TaskRepository taskRepo;
    private final AiServiceClient aiClient;

    public record HintRequest(String code) {}
    public record HintResponse(String hint, String nextAction) {}

    @PostMapping("/{taskId}")
    public ResponseEntity<HintResponse> getHint(
            @PathVariable Long taskId,
            @AuthenticationPrincipal String userId,
            @RequestBody(required = false) HintRequest body) {

        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        String code = body != null && body.code() != null ? body.code() : "";
        AiServiceClient.AiHintResult result = aiClient.hint(task, Long.parseLong(userId), code);

        if (result == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Hint service unavailable");
        }

        return ResponseEntity.ok(new HintResponse(result.hint(), result.nextAction()));
    }
}
