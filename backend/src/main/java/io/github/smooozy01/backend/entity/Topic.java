package io.github.smooozy01.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "topics")
@Getter @Setter
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String duration;
    private String level;
    private String tag;

    @Column(columnDefinition = "TEXT")
    private String contentIntro;

    private String contentSectionTitle;

    @Column(columnDefinition = "TEXT")
    private String contentSectionText;

    @Column(columnDefinition = "TEXT")
    private String contentCode;

    @Column(columnDefinition = "TEXT")
    private String contentTip;

    @Column(columnDefinition = "TEXT")
    private String contentWarning;

    private Integer orderIndex;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
