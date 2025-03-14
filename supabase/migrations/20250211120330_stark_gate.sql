/*
  # Update movie_list table schema
  
  1. Changes
    - Add new columns for detailed movie information
    - Update existing table structure while preserving data
    - Rename 'cast' to 'cast_members' to avoid reserved keyword conflict
*/

-- Add new columns to the movie_list table
ALTER TABLE movie_list 
  ADD COLUMN IF NOT EXISTS release_day INTEGER,
  ADD COLUMN IF NOT EXISTS release_month INTEGER,
  ADD COLUMN IF NOT EXISTS release_year INTEGER,
  ADD COLUMN IF NOT EXISTS release_date DATE,
  ADD COLUMN IF NOT EXISTS cast_members TEXT[],
  ADD COLUMN IF NOT EXISTS director TEXT,
  ADD COLUMN IF NOT EXISTS production_house TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT,
  ADD COLUMN IF NOT EXISTS ott_details_collected BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ott_details JSONB,
  ADD COLUMN IF NOT EXISTS ott_release_date DATE,
  ADD COLUMN IF NOT EXISTS ott_platform TEXT,
  ADD COLUMN IF NOT EXISTS ott_link TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_movie_list_updated_at
    BEFORE UPDATE ON movie_list
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();