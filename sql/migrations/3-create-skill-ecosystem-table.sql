-- Create table to store ecosystems.
CREATE TABLE skills.skill_ecosystem (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE NOT NULL
);
