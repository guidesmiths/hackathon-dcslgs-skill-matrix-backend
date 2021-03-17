-- Create table to store accounts.
CREATE TABLE skills.skill_catalog (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE NOT NULL,
  "type" INTEGER REFERENCES skills.skill_type(id) ON DELETE CASCADE,
  ecosystem INTEGER REFERENCES skills.skill_ecosystem(id) ON DELETE CASCADE,
  "role" INTEGER REFERENCES skills.skill_role(id) ON DELETE CASCADE,
  "description" VARCHAR(500) DEFAULT '',
  levels JSONB NOT NULL DEFAULT '{}'::JSONB
);
