package com.example.be.module.referee.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InspectHorseRequest {

	@NotNull
	private HorseInspectionDecision decision;

	private String note;
}
