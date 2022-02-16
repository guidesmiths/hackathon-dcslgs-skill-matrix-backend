-- Create table to store skills value for user.
CREATE TABLE skills.user_skill (
  id SERIAL PRIMARY KEY,
  skill_id INTEGER REFERENCES skills.skill_catalog(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES skills.user(user_id) ON DELETE CASCADE,
  skill_value INTEGER,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE skills.user_skill
  ADD CONSTRAINT skill_id_per_user_uk UNIQUE (skill_id, user_id);

CREATE INDEX
  IF NOT EXISTS skill_value_per_user_idx
  ON skills.user_skill(skill_id, user_id);

CREATE TRIGGER update_last_modification_date
  BEFORE UPDATE ON skills.user_skill
  FOR EACH ROW EXECUTE PROCEDURE update_last_modification_date();

