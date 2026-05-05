package io.github.smooozy01.backend.repository;

import io.github.smooozy01.backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findAllByOrderByOrderIndexAsc();
}
