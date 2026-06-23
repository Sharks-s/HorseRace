package com.example.be.module.referee.dto.response;

import com.example.be.module.result.model.entity.RaceResult;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class RaceResultResponse {

	private UUID resultID;
	private UUID horseID;
	private String horseName;
	private UUID jockeyID;
	private String jockeyName;
	private Double finishTime;
	private Integer rank;
	private boolean violationFlag;

	public static RaceResultResponse fromEntity(RaceResult result) {
		return RaceResultResponse.builder()
				.resultID(result.getResultID())
				.horseID(result.getHorse().getId())
				.horseName(result.getHorse().getName())
				.jockeyID(result.getJockey().getId())
				.jockeyName(result.getJockey().getFullName())
				.finishTime(result.getFinishTime())
				.rank(result.getRank())
				.violationFlag(result.isViolationFlag())
				.build();
	}
}
