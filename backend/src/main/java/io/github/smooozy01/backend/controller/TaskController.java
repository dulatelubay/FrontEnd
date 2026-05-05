package io.github.smooozy01.backend.controller;

import io.github.smooozy01.backend.dto.response.TaskResponse;
import io.github.smooozy01.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    @GetMapping
    public List<TaskResponse> getAll(@RequestParam(required = false) Long topicId) {
        return topicId != null ? service.getByTopic(topicId) : service.getAll();
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }
}
