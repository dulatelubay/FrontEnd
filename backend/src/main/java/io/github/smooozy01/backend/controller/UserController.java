package io.github.smooozy01.backend.controller;

import io.github.smooozy01.backend.dto.request.CreateUserRequest;
import io.github.smooozy01.backend.dto.response.UserResponse;
import io.github.smooozy01.backend.entity.Role;
import io.github.smooozy01.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping
    public List<UserResponse> list(@RequestParam(defaultValue = "STUDENT") String role) {
        return service.getByRole(Role.valueOf(role.toUpperCase()));
    }

    @PostMapping("/students")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createStudent(@Valid @RequestBody CreateUserRequest req) {
        return service.create(req, Role.STUDENT);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id,
                       @AuthenticationPrincipal String userId) {
        service.delete(id, Long.parseLong(userId));
    }
}
