package com.example.be.module.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectHorseRequest {

	@NotBlank(message = "Reject reason is required")
	private String reason;
}
