--liquibase formatted sql
--changeset samson.kayode:003
CREATE TABLE IF NOT EXISTS job_votes (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    visitor_id VARCHAR(255) NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    CONSTRAINT fk_votes_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
);
