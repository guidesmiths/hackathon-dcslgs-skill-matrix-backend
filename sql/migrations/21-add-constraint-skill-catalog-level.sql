-- ALTER TABLE skills.skill_catalog_level
--   DROP COLUMN id;

-- ALTER TABLE skills.skill_catalog_level
--   DROP CONSTRAINT skill_catalog_level_pkey;

-- ALTER TABLE skills.skill_catalog_level
--   ADD CONSTRAINT level_per_skill_uk UNIQUE ("level",skill_id);

-- CREATE UNIQUE INDEX skill_catalog_level_skill_id_idx ON skills.skill_catalog_level (skill_id,"level");

-- CREATE TRIGGER update_last_modification_date
--   BEFORE UPDATE ON skills.skill_catalog_level
--   FOR EACH ROW EXECUTE PROCEDURE update_last_modification_date();

