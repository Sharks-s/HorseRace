package com.example.be.module.jockey.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JockeyProfileRequest {

	@NotBlank(message = "License number is required")
	private String licenseNo;

	@NotBlank(message = "Name is required")
	private String name;

	@NotNull(message = "Weight is required")
	@Positive(message = "Weight must be greater than 0")
	private Double weight;

	private String bio;
}
