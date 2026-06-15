package com.example.be.module.horse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HorseUpdateRequest {

	@NotBlank(message = "Tên ngựa không được để trống")
	private String name;

	@NotBlank(message = "Giống ngựa không được để trống")
	private String breed;

	@NotNull(message = "Tuổi ngựa không được để trống")
	@Positive(message = "Tuổi ngựa phải lớn hơn 0")
	private Integer age;

	@NotNull(message = "Cân nặng không được để trống")
	@Positive(message = "Cân nặng phải lớn hơn 0")
	private Double weight;

	@NotNull(message = "Ngày hết hạn giấy chứng nhận sức khỏe không được để trống")
	private LocalDate healthCertExpiry;
}