package io.github.smooozy01.backend.controller;

import io.github.smooozy01.backend.dto.response.TopicResponse;
import io.github.smooozy01.backend.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService service;

    @GetMapping
    public List<TopicResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public TopicResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }
}
