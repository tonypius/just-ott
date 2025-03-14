/*
  # Create items table for search functionality

  1. New Tables
    - `items`
      - `id` (uuid, primary key)
      - `title` (text, for search results)
      - `description` (text, detailed information)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `items` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON items
  FOR SELECT
  TO public
  USING (true);