package io.github.smooozy01.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;

/**
 * Partial update payload — every field is optional; only the provided
 * fields are applied. Password is left untouched when null/blank.
 */
@Getter
public class UpdateUserRequest {

    private String name;

    @Email
    private String email;

    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

    private String role;
    private String classGroup;
    private String phone;
}
