package io.github.smooozy01.backend.service;

import io.github.smooozy01.backend.dto.request.LoginRequest;
import io.github.smooozy01.backend.dto.request.RefreshRequest;
import io.github.smooozy01.backend.dto.response.AuthResponse;
import io.github.smooozy01.backend.dto.response.UserResponse;
import io.github.smooozy01.backend.entity.User;
import io.github.smooozy01.backend.repository.UserRepository;
import io.github.smooozy01.backend.security.JwtProperties;
import io.github.smooozy01.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository       userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil              jwtUtil;
    private final JwtProperties        jwtProperties;
    private final StringRedisTemplate  redisTemplate;

    public AuthResponse login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        // Update last active timestamp
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.save(user);

        return buildTokenPair(user);
    }

    public AuthResponse refresh(RefreshRequest req) {
        String key = "refresh:" + req.getRefreshToken();
        String userIdStr = redisTemplate.opsForValue().get(key);

        if (userIdStr == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired or invalid");
        }

        // Rotate: delete old refresh token
        redisTemplate.delete(key);

        User user = userRepository.findById(Long.parseLong(userIdStr))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        return buildTokenPair(user);
    }

    public void logout(String accessToken, String rawRefreshToken) {
        // Blocklist the access token for its remaining lifetime
        try {
            String jti = jwtUtil.extractJti(accessToken);
            long remaining = jwtUtil.getRemainingSeconds(accessToken);
            if (remaining > 0) {
                redisTemplate.opsForValue().set(
                        "blocklist:" + jti, "1", remaining, TimeUnit.SECONDS
                );
            }
        } catch (Exception ignored) {
            // Token already expired — nothing to blocklist
        }

        // Remove refresh token if provided
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            redisTemplate.delete("refresh:" + rawRefreshToken);
        }
    }

    public UserResponse me(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return new UserResponse(user);
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private AuthResponse buildTokenPair(User user) {
        String accessToken  = jwtUtil.generateAccessToken(user.getId(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken();

        redisTemplate.opsForValue().set(
                "refresh:" + refreshToken,
                user.getId().toString(),
                jwtProperties.getRefreshExpirySeconds(),
                TimeUnit.SECONDS
        );

        return new AuthResponse(accessToken, refreshToken, new UserResponse(user));
    }
}
