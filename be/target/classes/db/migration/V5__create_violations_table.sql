CREATE TABLE IF NOT EXISTS violations (
    violation_id UUID PRIMARY KEY,
    race_id UUID NOT NULL,
    horse_id UUID NOT NULL,
    jockey_id UUID NOT NULL,
    referee_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    report_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_violations_race FOREIGN KEY (race_id) REFERENCES races(id),
    CONSTRAINT fk_violations_horse FOREIGN KEY (horse_id) REFERENCES horses(id),
    CONSTRAINT fk_violations_jockey FOREIGN KEY (jockey_id) REFERENCES users(id),
    CONSTRAINT fk_violations_referee FOREIGN KEY (referee_id) REFERENCES users(id),
    CONSTRAINT violations_type_check CHECK (
        type IN ('LANE_VIOLATION', 'FALSE_START', 'DANGEROUS_RIDING', 'OBSTRUCTION', 'OTHER')
    ),
    CONSTRAINT violations_severity_check CHECK (
        severity IN ('WARNING', 'DISQUALIFY')
    )
);
