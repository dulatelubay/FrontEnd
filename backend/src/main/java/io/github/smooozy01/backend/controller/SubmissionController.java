package io.github.smooozy01.backend.controller;

import io.github.smooozy01.backend.dto.request.GradeRequest;
import io.github.smooozy01.backend.dto.request.SubmitCodeRequest;
import io.github.smooozy01.backend.dto.response.SubmissionDetailResponse;
import io.github.smooozy01.backend.dto.response.SubmissionResponse;
import io.github.smooozy01.backend.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse submit(@Valid @RequestBody SubmitCodeRequest req,
                                     @AuthenticationPrincipal String userId) {
        return service.submit(req.getTaskId(), Long.parseLong(userId), req.getCode());
    }

    @GetMapping("/my")
    public List<SubmissionResponse> getMine(@AuthenticationPrincipal String userId) {
        return service.getMySubmissions(Long.parseLong(userId));
    }

    @GetMapping("/task/{taskId}")
    public List<SubmissionDetailResponse> getForTask(@PathVariable Long taskId) {
        return service.getSubmissionsForTask(taskId);
    }

    @PutMapping("/{id}/grade")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void grade(@PathVariable Long id, @Valid @RequestBody GradeRequest req) {
        service.grade(id, req.getGrade(), req.getFeedback());
    }
}
