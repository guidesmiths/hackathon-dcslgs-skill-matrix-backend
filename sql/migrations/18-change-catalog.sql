ALTER TABLE skills.skill_catalog
  DROP CONSTRAINT "skill_catalog_name_key";

ALTER TABLE skills.skill_catalog
  ALTER COLUMN "name" TYPE TEXT;

ALTER TABLE skills.skill_catalog
  ADD CONSTRAINT skill_name_in_ecosystem_uk UNIQUE ("name", ecosystem);

CREATE INDEX
  IF NOT EXISTS skill_name_value_ecosystem_idx
  ON skills.skill_catalog("name", ecosystem);

CREATE TRIGGER update_last_modification_date
  BEFORE UPDATE ON skills.skill_catalog
  FOR EACH ROW EXECUTE PROCEDURE update_last_modification_date();