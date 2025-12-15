--liquibase formatted sql
--changeset samson.kayode:002
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(100) NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jobs_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
);
