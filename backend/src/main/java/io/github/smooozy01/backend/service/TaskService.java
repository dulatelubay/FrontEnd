package io.github.smooozy01.backend.service;

import io.github.smooozy01.backend.dto.response.TaskResponse;
import io.github.smooozy01.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repo;

    public List<TaskResponse> getAll() {
        return repo.findAllByOrderByOrderIndexAsc()
                   .stream()
                   .map(TaskResponse::new)
                   .toList();
    }

    public List<TaskResponse> getByTopic(Long topicId) {
        return repo.findByTopicIdOrderByOrderIndexAsc(topicId)
                   .stream()
                   .map(TaskResponse::new)
                   .toList();
    }

    public TaskResponse getById(Long id) {
        return repo.findById(id)
                   .map(TaskResponse::new)
                   .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }
}
