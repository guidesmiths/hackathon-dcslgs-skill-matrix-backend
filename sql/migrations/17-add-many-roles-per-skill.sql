-- -- Create table to store many roles per skill.
-- CREATE TABLE skills.skill_role_catalog (
--   id SERIAL PRIMARY KEY,
--   skill_id INTEGER REFERENCES skills.skill_catalog(id) ON DELETE CASCADE,
--   role_id INTEGER REFERENCES skills.skill_role(id) ON DELETE CASCADE,
--   created_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
--   updated_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
-- );

-- ALTER TABLE skills.skill_role_catalog
--   ADD CONSTRAINT role_id_per_skill_uk UNIQUE (role_id, skill_id);

-- CREATE TRIGGER update_last_modification_date
--   BEFORE UPDATE ON skills.skill_role_catalog
--   FOR EACH ROW EXECUTE PROCEDURE update_last_modification_date();

