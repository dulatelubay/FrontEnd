package io.github.smooozy01.backend.controller;

import io.github.smooozy01.backend.dto.request.CreateUserRequest;
import io.github.smooozy01.backend.dto.request.UpdateUserRequest;
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
    public List<UserResponse> list(@RequestParam(required = false) String role) {
        if (role == null || role.isBlank() || role.equalsIgnoreCase("all")) {
            return service.getAll();
        }
        return service.getByRole(Role.valueOf(role.toUpperCase()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateUserRequest req) {
        Role role = (req.getRole() == null || req.getRole().isBlank())
                ? Role.STUDENT
                : Role.valueOf(req.getRole().toUpperCase());
        return service.create(req, role);
    }

    @PostMapping("/students")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createStudent(@Valid @RequestBody CreateUserRequest req) {
        return service.create(req, Role.STUDENT);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id,
                               @Valid @RequestBody UpdateUserRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id,
                       @AuthenticationPrincipal String userId) {
        service.delete(id, Long.parseLong(userId));
    }
}
