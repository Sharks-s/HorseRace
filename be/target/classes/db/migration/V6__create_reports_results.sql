ALTER TABLE races
    DROP CONSTRAINT IF EXISTS races_status_check;

ALTER TABLE race_results
    ADD COLUMN IF NOT EXISTS finish_time DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS rank INTEGER,
    ADD COLUMN IF NOT EXISTS score DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS violation_flag BOOLEAN DEFAULT FALSE;

UPDATE race_results
SET finish_time = COALESCE(finish_time, 0),
    rank = COALESCE(rank, placement),
    score = COALESCE(score, 0),
    violation_flag = COALESCE(violation_flag, FALSE);

ALTER TABLE race_results
    ALTER COLUMN finish_time SET NOT NULL,
    ALTER COLUMN rank SET NOT NULL,
    ALTER COLUMN score SET NOT NULL,
    ALTER COLUMN violation_flag SET NOT NULL;

CREATE TABLE IF NOT EXISTS referee_reports (
    id UUID PRIMARY KEY,
    race_id UUID NOT NULL UNIQUE REFERENCES races(id),
    referee_id UUID NOT NULL REFERENCES users(id),
    confirmed_result BOOLEAN NOT NULL,
    submitted_at TIMESTAMP NOT NULL
);
