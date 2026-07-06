package com.example.be.module.horse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HorseCreateRequest {

	@NotBlank(message = "Horse name must not be blank.")
	private String name;

	@NotBlank(message = "Horse breed must not be blank.")
	private String breed;

	@NotNull(message = "Horse age must not be blank.")
	@Positive(message = "Horse age must be a positive number.")
	private Integer age;

	@NotNull(message = "Horse weight must not be blank.")
	@Positive(message = "Horse weight must be a positive number.")
	private Double weight;

	@NotNull(message = "Horse health certificate expiry date must not be blank.")
	private LocalDate healthCertExpiry;
}