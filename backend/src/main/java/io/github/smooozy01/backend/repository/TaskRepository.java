package io.github.smooozy01.backend.repository;

import io.github.smooozy01.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByOrderByOrderIndexAsc();
    List<Task> findByTopicIdOrderByOrderIndexAsc(Long topicId);
}
