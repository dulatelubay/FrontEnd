package io.github.smooozy01.backend.dto.response;

import io.github.smooozy01.backend.entity.User;
import lombok.Getter;

@Getter
public class UserResponse {
    private final Long   id;
    private final String email;
    private final String name;
    private final String role;
    private final String group;

    public UserResponse(User user) {
        this.id    = user.getId();
        this.email = user.getEmail();
        this.name  = user.getName();
        this.role  = user.getRole().name().toLowerCase();
        this.group = user.getGroup();
    }
}
