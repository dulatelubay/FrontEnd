package io.github.smooozy01.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter @Setter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;

    private String level;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String exampleInput;
    private String exampleOutput;

    @Column(columnDefinition = "TEXT")
    private String solution;

    private Integer orderIndex;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
