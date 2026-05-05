package io.github.smooozy01.backend.service;

import io.github.smooozy01.backend.dto.response.TopicResponse;
import io.github.smooozy01.backend.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository repo;

    public List<TopicResponse> getAll() {
        return repo.findAllByOrderByOrderIndexAsc()
                   .stream()
                   .map(TopicResponse::new)
                   .toList();
    }

    public TopicResponse getById(Long id) {
        return repo.findById(id)
                   .map(TopicResponse::new)
                   .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
    }
}
