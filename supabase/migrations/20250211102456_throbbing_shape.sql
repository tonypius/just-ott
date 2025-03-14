/*
  # Create movie_list table with search capabilities

  1. Extensions
    - Enable pg_trgm extension for text search capabilities
  2. New Tables
    - `movie_list`
      - `id` (uuid, primary key)
      - `title` (text, searchable)
      - `description` (text)
      - `created_at` (timestamp)
  3. Security
    - Enable RLS on `movie_list` table
    - Add policy for public read access
  4. Indexes
    - Add GIN index on title for efficient text search
*/

-- First, enable the pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Then create the table
CREATE TABLE IF NOT EXISTS movie_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE movie_list ENABLE ROW LEVEL SECURITY;

-- Add read policy
CREATE POLICY "Allow public read access"
  ON movie_list
  FOR SELECT
  TO public
  USING (true);

-- Create the search index after the extension is enabled
CREATE INDEX IF NOT EXISTS idx_movie_list_title ON movie_list USING gin (title gin_trgm_ops);