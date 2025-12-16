--liquibase formatted sql
--changeset samson.kayode:004
INSERT INTO categories (name) VALUES
('Information Technology'),
('Engineering'),
('Finance & Accounting'),
('Education & Training'),
('Healthcare & Medical'),
('Sales & Marketing'),
('Human Resources'),
('Customer Service'),
('Manufacturing & Production'),
('Logistics & Supply Chain'),
('Construction & Real Estate'),
('Hospitality & Tourism'),
('Creative & Design'),
('Legal'),
('Agriculture'),
('Government & Public Sector'),
('Others');
