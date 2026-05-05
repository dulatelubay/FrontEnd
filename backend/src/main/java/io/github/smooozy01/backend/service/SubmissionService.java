package io.github.smooozy01.backend.service;

import io.github.smooozy01.backend.dto.response.SubmissionDetailResponse;
import io.github.smooozy01.backend.dto.response.SubmissionResponse;
import io.github.smooozy01.backend.entity.Task;
import io.github.smooozy01.backend.entity.TaskSubmission;
import io.github.smooozy01.backend.entity.User;
import io.github.smooozy01.backend.repository.TaskRepository;
import io.github.smooozy01.backend.repository.TaskSubmissionRepository;
import io.github.smooozy01.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final TaskSubmissionRepository repo;
    private final TaskRepository           taskRepo;
    private final UserRepository           userRepo;
    private final PythonService            pythonService;
    private final AiServiceClient          aiClient;

    public SubmissionResponse submit(Long taskId, Long studentId, String code) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        TaskSubmission sub = repo.findByTaskIdAndStudentId(taskId, studentId)
                .orElseGet(() -> {
                    TaskSubmission s = new TaskSubmission();
                    s.setTask(task);
                    s.setStudent(student);
                    return s;
                });

        int attempts = sub.getAttempts() != null ? sub.getAttempts() : 0;
        if (attempts >= 5) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(422), "Maximum attempts reached");
        }

        sub.setSubmittedCode(code);
        sub.setStatus("pending");
        sub.setAttempts(attempts + 1);
        sub.setSubmittedAt(LocalDateTime.now());
        TaskSubmission saved = repo.save(sub);

        // Run sandbox + AI grading in background; submission stays "pending" on failure
        CompletableFuture.runAsync(() -> gradeWithAi(saved.getId(), task, code));

        return new SubmissionResponse(saved);
    }

    private void gradeWithAi(Long submissionId, Task task, String code) {
        try {
            var sandbox = pythonService.runCode(code);
            var result  = aiClient.grade(task, code, sandbox);
            if (result == null) return;

            repo.findById(submissionId).ifPresent(sub -> {
                sub.setAiGrade(result.grade());
                sub.setAiFeedback(result.feedback());
                sub.setStatus("ai_graded");
                sub.setGradedAt(LocalDateTime.now());
                repo.save(sub);
            });
        } catch (Exception ignored) {
            // submission stays "pending" — teacher grades manually
        }
    }

    public List<SubmissionResponse> getMySubmissions(Long studentId) {
        return repo.findByStudentId(studentId)
                .stream()
                .map(SubmissionResponse::new)
                .toList();
    }

    public List<SubmissionDetailResponse> getSubmissionsForTask(Long taskId) {
        return repo.findByTaskId(taskId)
                .stream()
                .map(SubmissionDetailResponse::new)
                .toList();
    }

    public void grade(Long submissionId, Integer grade, String feedback) {
        TaskSubmission sub = repo.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));
        sub.setGrade(grade);
        sub.setFeedback(feedback);
        sub.setStatus("graded");
        sub.setGradedAt(LocalDateTime.now());
        repo.save(sub);
    }
}
