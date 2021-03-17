--- Run script to truncate the data in all tables within the skills schema
DO $$
DECLARE
  row record;
BEGIN
  FOR row IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'skills'
  LOOP
    EXECUTE format('TRUNCATE skills.%I RESTART IDENTITY CASCADE', row.table_name);
  END LOOP;
END;
$$ LANGUAGE plpgsql;
