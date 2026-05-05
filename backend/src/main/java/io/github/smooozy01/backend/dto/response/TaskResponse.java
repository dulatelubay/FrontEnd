package io.github.smooozy01.backend.dto.response;

import io.github.smooozy01.backend.entity.Task;
import lombok.Getter;

@Getter
public class TaskResponse {

    private final Long   id;
    private final String title;
    private final Long   topicId;
    private final String topic;
    private final String level;
    private final String description;
    private final String exampleInput;
    private final String exampleOutput;
    private final String solution;

    public TaskResponse(Task t) {
        this.id            = t.getId();
        this.title         = t.getTitle();
        this.topicId       = t.getTopic() != null ? t.getTopic().getId() : null;
        this.topic         = t.getTopic() != null ? t.getTopic().getTitle() : null;
        this.level         = t.getLevel();
        this.description   = t.getDescription();
        this.exampleInput  = t.getExampleInput();
        this.exampleOutput = t.getExampleOutput();
        this.solution      = t.getSolution();
    }
}
