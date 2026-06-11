package com.example.be.module.referee.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class SubmitRaceResultRequest {

	@NotEmpty
	@Valid
	private List<HorseFinishTimeRequest> results;

	@Getter
	@Setter
	public static class HorseFinishTimeRequest {

		@NotNull
		private UUID horseId;

		@NotNull
		@Positive
		private Double finishTime;
	}
}
