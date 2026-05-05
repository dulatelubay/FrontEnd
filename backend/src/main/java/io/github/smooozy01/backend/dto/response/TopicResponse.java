package io.github.smooozy01.backend.dto.response;

import io.github.smooozy01.backend.entity.Topic;
import lombok.Getter;

@Getter
public class TopicResponse {

    private final Long   id;
    private final String title;
    private final String duration;
    private final String level;
    private final String tag;
    private final Content content;

    public TopicResponse(Topic t) {
        this.id       = t.getId();
        this.title    = t.getTitle();
        this.duration = t.getDuration();
        this.level    = t.getLevel();
        this.tag      = t.getTag();
        this.content  = new Content(t);
    }

    @Getter
    public static class Content {
        private final String intro;
        private final String sectionTitle;
        private final String sectionText;
        private final String code;
        private final String tip;
        private final String warning;

        Content(Topic t) {
            this.intro        = t.getContentIntro();
            this.sectionTitle = t.getContentSectionTitle();
            this.sectionText  = t.getContentSectionText();
            this.code         = t.getContentCode();
            this.tip          = t.getContentTip();
            this.warning      = t.getContentWarning();
        }
    }
}
