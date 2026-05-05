package io.github.smooozy01.backend.dto.response;

import io.github.smooozy01.backend.entity.TaskSubmission;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class SubmissionResponse {

    private final Long   id;
    private final Long   taskId;
    private final String taskTitle;
    private final String topicTitle;
    private final String level;
    private final String status;
    private final String submittedCode;
    private final String  feedback;
    private final Integer grade;
    private final Integer aiGrade;
    private final String  aiFeedback;
    private final Integer attempts;
    private final LocalDateTime submittedAt;

    public SubmissionResponse(TaskSubmission s) {
        this.id            = s.getId();
        this.taskId        = s.getTask().getId();
        this.taskTitle     = s.getTask().getTitle();
        this.topicTitle    = s.getTask().getTopic() != null ? s.getTask().getTopic().getTitle() : null;
        this.level         = s.getTask().getLevel();
        this.status        = s.getStatus();
        this.submittedCode = s.getSubmittedCode();
        this.feedback      = s.getFeedback();
        this.grade         = s.getGrade();
        this.aiGrade       = s.getAiGrade();
        this.aiFeedback    = s.getAiFeedback();
        this.attempts      = s.getAttempts() != null ? s.getAttempts() : 0;
        this.submittedAt   = s.getSubmittedAt();
    }
}
