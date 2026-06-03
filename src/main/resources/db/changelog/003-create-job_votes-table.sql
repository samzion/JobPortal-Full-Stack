--liquibase formatted sql
--changeset samson.kayode:003
CREATE TABLE IF NOT EXISTS job_votes (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    visitor_id VARCHAR(255) NOT NULL,
    vote_type VARCHAR(10) NOT NULL,

    CONSTRAINT fk_votes_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id),

    CONSTRAINT uq_visitor_job_vote
        UNIQUE (job_id, visitor_id)
);
