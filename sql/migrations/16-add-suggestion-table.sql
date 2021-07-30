CREATE TYPE subject_type as ENUM('Others', 'Skills', 'Ecosystems');

-- Create table to suggestions.
CREATE TABLE skills.user_suggestion (
  id SERIAL PRIMARY KEY,
  "description" TEXT,
  "subject" subject_type,
  user_id TEXT REFERENCES skills.user(user_id) ON DELETE CASCADE,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);