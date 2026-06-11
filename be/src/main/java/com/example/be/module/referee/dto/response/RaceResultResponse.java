package com.example.be.module.referee.dto.response;

import com.example.be.module.result.model.entity.RaceResult;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class RaceResultResponse {

	private UUID id;
	private UUID horseId;
	private String horseName;
	private UUID jockeyId;
	private String jockeyName;
	private Double finishTime;
	private Integer rank;
	private Double score;
	private Boolean violationFlag;
	private Double points;

	public static RaceResultResponse fromEntity(RaceResult result) {
		return RaceResultResponse.builder()
				.id(result.getId())
				.horseId(result.getHorse().getId())
				.horseName(result.getHorse().getName())
				.jockeyId(result.getJockey().getId())
				.jockeyName(result.getJockey().getFullName())
				.finishTime(result.getFinishTime())
				.rank(result.getRank())
				.score(result.getScore())
				.violationFlag(result.getViolationFlag())
				.points(result.getPoints())
				.build();
	}
}
