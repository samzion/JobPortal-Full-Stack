--liquibase formatted sql
--changeset samson.kayode:007

ALTER TABLE jobs ADD CONSTRAINT unique_job_posting UNIQUE (title, company);