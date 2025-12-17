
--liquibase formatted sql
--changeset samson.kayode:006

ALTER TABLE jobs
ADD COLUMN likes INTEGER NOT NULL DEFAULT 0,
ADD COLUMN dislikes INTEGER NOT NULL DEFAULT 0;