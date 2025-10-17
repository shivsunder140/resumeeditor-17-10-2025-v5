/*
  # Create Resumes Table

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text) - Resume title
      - `type` (text) - Type: 'master' or 'campaign'
      - `content` (text) - HTML content of the resume
      - `ats_score` (integer) - ATS optimization score 0-100
      - `template_id` (text) - Selected template identifier
      - `colors` (jsonb) - Color palette settings
      - `formatting` (jsonb) - Formatting settings
      - `active_sections` (text[]) - Array of active section names
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `resumes` table
    - Add policy for users to read their own resumes
    - Add policy for users to insert their own resumes
    - Add policy for users to update their own resumes
    - Add policy for users to delete their own resumes
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Resume',
  type text NOT NULL DEFAULT 'master' CHECK (type IN ('master', 'campaign')),
  content text NOT NULL DEFAULT '',
  ats_score integer DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
  template_id text DEFAULT 'classic-1',
  colors jsonb DEFAULT '{"primary": "#3B82F6", "secondary": "#64748B", "accent": "#8B5CF6"}'::jsonb,
  formatting jsonb DEFAULT '{
    "alignment": "left",
    "textColor": "#334155",
    "highlightColor": "transparent",
    "fontStyle": "Inter",
    "fontSize": 11,
    "headingSize": 14,
    "sectionSpacing": 16,
    "paragraphSpacing": 8,
    "lineSpacing": 1.4,
    "topBottomMargin": 20,
    "sideMargins": 20,
    "paragraphIndent": 0
  }'::jsonb,
  active_sections text[] DEFAULT ARRAY['Heading', 'Profile', 'Core Skills', 'Experience', 'Education'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id);
CREATE INDEX IF NOT EXISTS resumes_updated_at_idx ON resumes(updated_at DESC);