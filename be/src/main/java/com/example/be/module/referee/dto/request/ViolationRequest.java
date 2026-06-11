package com.example.be.module.referee.dto.request;

import com.example.be.module.referee.model.enums.ViolationSeverity;
import com.example.be.module.referee.model.enums.ViolationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ViolationRequest {

	@NotNull
	private UUID raceId;

	@NotNull
	private UUID horseId;

	@NotNull
	private UUID jockeyId;

	@NotNull
	private ViolationType type;

	@NotBlank
	private String description;

	@NotNull
	private ViolationSeverity severity;

	private LocalDateTime timestamp;
}
