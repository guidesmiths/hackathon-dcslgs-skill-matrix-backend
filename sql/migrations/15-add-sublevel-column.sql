CREATE TYPE skills.subvalue_type as ENUM('minus', 'neutral', 'plus');

ALTER TABLE skills.user_skill
ADD COLUMN skill_subvalue skills.subvalue_type;