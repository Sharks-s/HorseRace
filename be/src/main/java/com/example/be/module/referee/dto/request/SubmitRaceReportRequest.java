package com.example.be.module.referee.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class SubmitRaceReportRequest {

	@NotNull
	@JsonProperty("horseID")
	@JsonAlias("horseId")
	private UUID horseID;

	@NotNull
	@Positive
	private Double finishTime;
}
