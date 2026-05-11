package io.github.smooozy01.backend.service;

import io.github.smooozy01.backend.dto.request.CreateUserRequest;
import io.github.smooozy01.backend.dto.response.UserResponse;
import io.github.smooozy01.backend.entity.Role;
import io.github.smooozy01.backend.entity.User;
import io.github.smooozy01.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository    repo;
    private final PasswordEncoder   encoder;

    public List<UserResponse> getByRole(Role role) {
        return repo.findByRoleOrderByNameAsc(role)
                   .stream()
                   .map(UserResponse::new)
                   .toList();
    }

    public List<UserResponse> getAll() {
        return repo.findAllByOrderByNameAsc()
                   .stream()
                   .map(UserResponse::new)
                   .toList();
    }

    public UserResponse create(CreateUserRequest req, Role role) {
        if (repo.existsByEmail(req.getEmail().trim().toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        User user = User.builder()
                .name(req.getName().trim())
                .email(req.getEmail().trim().toLowerCase())
                .passwordHash(encoder.encode(req.getPassword()))
                .role(role)
                .group(req.getClassGroup())
                .phone(req.getPhone())
                .build();

        return new UserResponse(repo.save(user));
    }

    public void delete(Long id, Long requesterId) {
        if (id.equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete your own account");
        }
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        repo.deleteById(id);
    }
}
