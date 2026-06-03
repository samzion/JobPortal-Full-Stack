
--liquibase formatted sql
--changeset samson.kayode:008

ALTER TABLE jobs DROP COLUMN IF EXISTS likes;
ALTER TABLE jobs DROP COLUMN IF EXISTS dislikes;
