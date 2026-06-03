--liquibase formatted sql

--changeset samson:011-add-user-to-jobs
ALTER TABLE jobs ADD COLUMN posted_by BIGINT;
ALTER TABLE jobs ADD COLUMN location VARCHAR(255);
ALTER TABLE jobs ADD COLUMN salary_range VARCHAR(100);

-- Add foreign key constraint
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_posted_by 
    FOREIGN KEY (posted_by) REFERENCES users(id);

CREATE INDEX idx_jobs_posted_by ON jobs(posted_by);