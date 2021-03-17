-- Create table to store roles.
CREATE TABLE skills.skill_role (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE NOT NULL
);
