CREATE TABLE topics (
    id                   BIGSERIAL    PRIMARY KEY,
    title                VARCHAR(255) NOT NULL,
    duration             VARCHAR(50),
    level                VARCHAR(50)  NOT NULL,
    tag                  VARCHAR(50),
    content_intro        TEXT,
    content_section_title VARCHAR(255),
    content_section_text TEXT,
    content_code         TEXT,
    content_tip          TEXT,
    content_warning      TEXT,
    order_index          INT          NOT NULL DEFAULT 0,
    created_at           TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
    id             BIGSERIAL    PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    topic_id       BIGINT       REFERENCES topics(id) ON DELETE SET NULL,
    level          VARCHAR(50)  NOT NULL,
    description    TEXT         NOT NULL,
    example_input  TEXT,
    example_output TEXT,
    solution       TEXT,
    order_index    INT          NOT NULL DEFAULT 0,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE task_submissions (
    id             BIGSERIAL    PRIMARY KEY,
    task_id        BIGINT       NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    student_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status         VARCHAR(20)  NOT NULL DEFAULT 'new',
    submitted_code TEXT,
    feedback       TEXT,
    grade          INT,
    submitted_at   TIMESTAMP,
    graded_at      TIMESTAMP,
    UNIQUE (task_id, student_id)
);

CREATE INDEX idx_tasks_topic ON tasks (topic_id);
CREATE INDEX idx_submissions_task    ON task_submissions (task_id);
CREATE INDEX idx_submissions_student ON task_submissions (student_id);
