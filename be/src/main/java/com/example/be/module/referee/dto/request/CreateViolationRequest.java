package com.example.be.module.referee.dto.request;

import com.example.be.module.referee.model.enums.ViolationSeverity;
import com.example.be.module.referee.model.enums.ViolationType;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class CreateViolationRequest {

	@NotNull
	@JsonProperty("horseID")
	@JsonAlias("horseId")
	private UUID horseID;

	@NotNull
	@JsonProperty("jockeyID")
	@JsonAlias("jockeyId")
	private UUID jockeyID;

	@NotNull
	private ViolationType type;

	@NotBlank
	private String description;

	@NotNull
	private ViolationSeverity severity;

	private LocalDateTime timestamp;
}
