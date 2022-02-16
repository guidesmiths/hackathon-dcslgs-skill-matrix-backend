-- Create table to levels.
CREATE TABLE skills.skill_catalog_level (
  id SERIAL PRIMARY KEY,
  "level" INTEGER,
  "description" TEXT DEFAULT '',
  "skill_id" INTEGER REFERENCES skills.skill_catalog(id) ON DELETE CASCADE
);