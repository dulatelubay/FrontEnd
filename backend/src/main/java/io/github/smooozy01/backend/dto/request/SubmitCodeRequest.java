package io.github.smooozy01.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SubmitCodeRequest {

    @NotNull
    private Long taskId;

    private String code;
}
