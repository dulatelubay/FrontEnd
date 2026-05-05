package io.github.smooozy01.backend.repository;

import io.github.smooozy01.backend.entity.TaskSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {
    List<TaskSubmission> findByStudentId(Long studentId);
    Optional<TaskSubmission> findByTaskIdAndStudentId(Long taskId, Long studentId);
    List<TaskSubmission> findByTaskId(Long taskId);
}
