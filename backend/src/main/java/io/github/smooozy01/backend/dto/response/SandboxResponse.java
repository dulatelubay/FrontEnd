package io.github.smooozy01.backend.dto.response;

import java.util.List;

public record SandboxResponse(String output, List<String> figures, String error) {}
