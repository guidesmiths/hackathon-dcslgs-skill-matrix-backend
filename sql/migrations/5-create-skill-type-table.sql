-- Create table to store skill types.
CREATE TABLE skills.skill_type (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE NOT NULL
);
