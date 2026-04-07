/*
  # Create Anime Database Schema

  ## Overview
  This migration creates the core database structure for the Mugenime anime streaming platform.
  
  ## New Tables
  
  ### 1. `anime`
  Main anime information table
  - `id` (uuid, PK) - Auto-generated ID
  - `anime_id` (text, unique) - Slug/identifier for URLs
  - `title` (text) - Anime title
  - `japanese` (text) - Japanese title
  - `poster` (text) - Poster image URL
  - `score` (text) - Rating/score
  - `type` (text) - TV, Movie, OVA, etc.
  - `status` (text) - Ongoing, Completed
  - `episodes` (text) - Total episodes
  - `duration` (text) - Episode duration
  - `aired` (text) - Air date
  - `studios` (text) - Production studio
  - `producers` (text) - Producers
  - `synopsis` (text) - Description
  - `release_day` (text) - Day of week for ongoing anime
  - `latest_release_date` (text) - Last episode date
  - `last_release_date` (text) - Completion date
  - `season` (text) - Season info
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### 2. `genres`
  Genre master table
  - `id` (uuid, PK)
  - `genre_id` (text, unique) - Slug for URLs
  - `title` (text) - Genre name
  - `created_at` (timestamptz)

  ### 3. `anime_genres`
  Junction table for anime-genre relationship
  - `id` (uuid, PK)
  - `anime_id` (uuid, FK to anime)
  - `genre_id` (uuid, FK to genres)
  - `created_at` (timestamptz)

  ### 4. `episodes`
  Episode information
  - `id` (uuid, PK)
  - `anime_id` (uuid, FK to anime)
  - `episode_id` (text, unique) - Slug for URLs
  - `title` (text) - Episode title
  - `eps` (integer) - Episode number
  - `release_time` (text) - Release date/time
  - `default_streaming_url` (text) - Primary video URL
  - `has_prev_episode` (boolean)
  - `has_next_episode` (boolean)
  - `credit` (text) - Credits
  - `encoder` (text) - Encoder info
  - `duration` (text) - Episode duration
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `streaming_servers`
  Available streaming servers per episode
  - `id` (uuid, PK)
  - `episode_id` (uuid, FK to episodes)
  - `quality` (text) - 360p, 480p, 720p, 1080p
  - `server_title` (text) - Server name
  - `server_id` (text) - Server identifier
  - `href` (text) - Server URL
  - `created_at` (timestamptz)

  ### 6. `download_links`
  Download links per episode
  - `id` (uuid, PK)
  - `episode_id` (uuid, FK to episodes)
  - `format` (text) - MP4, MKV
  - `quality` (text) - Resolution
  - `size` (text) - File size
  - `server_title` (text) - Host name
  - `url` (text) - Download URL
  - `created_at` (timestamptz)

  ### 7. `batch_downloads`
  Batch download information for completed anime
  - `id` (uuid, PK)
  - `anime_id` (uuid, FK to anime)
  - `batch_id` (text, unique) - Batch identifier
  - `title` (text) - Batch title
  - `uploaded_at` (text) - Upload date
  - `created_at` (timestamptz)

  ### 8. `batch_links`
  Individual batch download links
  - `id` (uuid, PK)
  - `batch_id` (uuid, FK to batch_downloads)
  - `format` (text) - MP4, MKV
  - `quality` (text) - Resolution
  - `size` (text) - File size
  - `server_title` (text) - Host name
  - `url` (text) - Download URL
  - `created_at` (timestamptz)

  ### 9. `schedules`
  Weekly anime schedule
  - `id` (uuid, PK)
  - `anime_id` (uuid, FK to anime)
  - `day` (text) - Day of week
  - `created_at` (timestamptz)

  ### 10. `recommendations`
  Anime recommendations
  - `id` (uuid, PK)
  - `anime_id` (uuid, FK to anime) - Source anime
  - `recommended_anime_id` (uuid, FK to anime) - Recommended anime
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access for all anime-related data
  - Admin-only write access (future implementation)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ANIME TABLE
CREATE TABLE IF NOT EXISTS anime (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id text UNIQUE NOT NULL,
  title text NOT NULL,
  japanese text,
  poster text,
  score text,
  type text,
  status text,
  episodes text,
  duration text,
  aired text,
  studios text,
  producers text,
  synopsis text,
  release_day text,
  latest_release_date text,
  last_release_date text,
  season text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE anime ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for anime"
  ON anime FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. GENRES TABLE
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  genre_id text UNIQUE NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for genres"
  ON genres FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. ANIME_GENRES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS anime_genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid REFERENCES anime(id) ON DELETE CASCADE,
  genre_id uuid REFERENCES genres(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(anime_id, genre_id)
);

ALTER TABLE anime_genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for anime_genres"
  ON anime_genres FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. EPISODES TABLE
CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid REFERENCES anime(id) ON DELETE CASCADE,
  episode_id text UNIQUE NOT NULL,
  title text NOT NULL,
  eps integer NOT NULL,
  release_time text,
  default_streaming_url text,
  has_prev_episode boolean DEFAULT false,
  has_next_episode boolean DEFAULT false,
  credit text,
  encoder text,
  duration text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for episodes"
  ON episodes FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. STREAMING_SERVERS TABLE
CREATE TABLE IF NOT EXISTS streaming_servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE,
  quality text NOT NULL,
  server_title text NOT NULL,
  server_id text NOT NULL,
  href text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE streaming_servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for streaming_servers"
  ON streaming_servers FOR SELECT
  TO anon, authenticated
  USING (true);

-- 6. DOWNLOAD_LINKS TABLE
CREATE TABLE IF NOT EXISTS download_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE,
  format text NOT NULL,
  quality text NOT NULL,
  size text,
  server_title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for download_links"
  ON download_links FOR SELECT
  TO anon, authenticated
  USING (true);

-- 7. BATCH_DOWNLOADS TABLE
CREATE TABLE IF NOT EXISTS batch_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid REFERENCES anime(id) ON DELETE CASCADE,
  batch_id text UNIQUE NOT NULL,
  title text NOT NULL,
  uploaded_at text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE batch_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for batch_downloads"
  ON batch_downloads FOR SELECT
  TO anon, authenticated
  USING (true);

-- 8. BATCH_LINKS TABLE
CREATE TABLE IF NOT EXISTS batch_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES batch_downloads(id) ON DELETE CASCADE,
  format text NOT NULL,
  quality text NOT NULL,
  size text,
  server_title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE batch_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for batch_links"
  ON batch_links FOR SELECT
  TO anon, authenticated
  USING (true);

-- 9. SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid REFERENCES anime(id) ON DELETE CASCADE,
  day text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(anime_id, day)
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for schedules"
  ON schedules FOR SELECT
  TO anon, authenticated
  USING (true);

-- 10. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid REFERENCES anime(id) ON DELETE CASCADE,
  recommended_anime_id uuid REFERENCES anime(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(anime_id, recommended_anime_id)
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for recommendations"
  ON recommendations FOR SELECT
  TO anon, authenticated
  USING (true);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_anime_anime_id ON anime(anime_id);
CREATE INDEX IF NOT EXISTS idx_anime_status ON anime(status);
CREATE INDEX IF NOT EXISTS idx_anime_type ON anime(type);
CREATE INDEX IF NOT EXISTS idx_anime_updated_at ON anime(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_episodes_anime_id ON episodes(anime_id);
CREATE INDEX IF NOT EXISTS idx_episodes_episode_id ON episodes(episode_id);
CREATE INDEX IF NOT EXISTS idx_episodes_eps ON episodes(eps);
CREATE INDEX IF NOT EXISTS idx_anime_genres_anime_id ON anime_genres(anime_id);
CREATE INDEX IF NOT EXISTS idx_anime_genres_genre_id ON anime_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day ON schedules(day);
CREATE INDEX IF NOT EXISTS idx_schedules_anime_id ON schedules(anime_id);

-- CREATE FULL-TEXT SEARCH INDEX
CREATE INDEX IF NOT EXISTS idx_anime_title_search ON anime USING gin(to_tsvector('simple', title));

-- CREATE UPDATE TRIGGER FOR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_anime_updated_at BEFORE UPDATE ON anime
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
