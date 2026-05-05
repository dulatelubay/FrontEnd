CREATE TABLE users (
    id               BIGSERIAL    PRIMARY KEY,
    email            VARCHAR(255) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    name             VARCHAR(255) NOT NULL,
    role             VARCHAR(20)  NOT NULL,
    class_group      VARCHAR(50),
    phone            VARCHAR(50),
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    last_active_at   TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role  ON users (role);
