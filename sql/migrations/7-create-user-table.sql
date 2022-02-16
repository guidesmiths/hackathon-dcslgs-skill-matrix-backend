-- Create table to store users.
CREATE TABLE IF NOT EXISTS skills.user (
  user_id TEXT PRIMARY KEY,
  email VARCHAR(250),
  img_url VARCHAR(250),
  "name" VARCHAR(50),
  domain VARCHAR(50),
  "role" VARCHAR(25) DEFAULT 'user'
);
