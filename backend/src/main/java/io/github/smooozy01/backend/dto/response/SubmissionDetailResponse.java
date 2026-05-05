package io.github.smooozy01.backend.dto.response;

import io.github.smooozy01.backend.entity.TaskSubmission;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class SubmissionDetailResponse {

    private final Long   id;
    private final Long   studentId;
    private final String studentName;
    private final String status;
    private final String submittedCode;
    private final String  feedback;
    private final Integer grade;
    private final Integer aiGrade;
    private final String  aiFeedback;
    private final LocalDateTime submittedAt;
    private final LocalDateTime gradedAt;

    public SubmissionDetailResponse(TaskSubmission s) {
        this.id            = s.getId();
        this.studentId     = s.getStudent().getId();
        this.studentName   = s.getStudent().getName();
        this.status        = s.getStatus();
        this.submittedCode = s.getSubmittedCode();
        this.feedback      = s.getFeedback();
        this.grade         = s.getGrade();
        this.aiGrade       = s.getAiGrade();
        this.aiFeedback    = s.getAiFeedback();
        this.submittedAt   = s.getSubmittedAt();
        this.gradedAt      = s.getGradedAt();
    }
}
