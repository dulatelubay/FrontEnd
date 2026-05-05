package io.github.smooozy01.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_submissions")
@Getter @Setter
public class TaskSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String submittedCode;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer grade;

    private Integer aiGrade;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    private Integer attempts = 0;

    private LocalDateTime submittedAt;
    private LocalDateTime gradedAt;
}
