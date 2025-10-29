-- ==============================================================
--  Alumni Club Database Schema
--  PostgreSQL initialization script
--  Authori: Filip Cokovski, Milija Knežević
--  Created: 2025-10-27
-- ==============================================================

-- 1) Kreiranje baze
-- CREATE database alumni_club_dev;

-- \c alumni_club_dev;

-- ==============================================================
--  Helper funkcije i triggeri
-- ==============================================================

-- Funkcija koja automatski postavlja updated_at pri svakom UPDATE-u
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ==============================================================
--  USERS tabela
-- ==============================================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'alumni',
  username VARCHAR(30) NOT NULL,
  profile_picture TEXT,
  enrollment_year INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  occupation VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Trigger za users
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- ==============================================================
--  POSTS tabela
-- ==============================================================

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  image_url TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger za posts
CREATE TRIGGER set_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- ==============================================================
--  COMMENTS tabela
-- ==============================================================

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger za comments
CREATE TRIGGER set_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- ==============================================================
--  EVENTS tabela
-- ==============================================================

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger za events
CREATE TRIGGER set_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- ==============================================================
--  PRIVATE_MESSAGES tabela
-- ==============================================================

CREATE TABLE private_messages (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sent_date TIMESTAMP DEFAULT now(),
  read_at TIMESTAMP,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger za private_messages
CREATE TRIGGER set_private_messages_updated_at
BEFORE UPDATE ON private_messages
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

-- ==============================================================
--  POST_LIKES tabela
-- ==============================================================

CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,    
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================
--  EVENT_REGISTRATION tabela
-- ==============================================================

CREATE TABLE event_registration (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  registered_at TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, event_id)
);

-- ==============================================================
--  INDEKSI ZA OPTIMIZACIJU PERFORMANSI
-- ==============================================================

-- Indeksi za korisnike
CREATE INDEX IF NOT EXISTS idx_users_graduation_year ON users(enrollment_year);

-- Indeksi za postove
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_content_fts ON posts USING GIN (to_tsvector('simple', content));

-- Indeksi za eventove
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- Indeksi za poruke
CREATE INDEX IF NOT EXISTS idx_messages_sender ON private_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON private_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_date ON private_messages(sent_date DESC);

-- Indeksi za event registracije
CREATE INDEX IF NOT EXISTS idx_eventreg_event ON event_registration(event_id);
CREATE INDEX IF NOT EXISTS idx_eventreg_user ON event_registration(user_id);

-- Indeksi za lajkove
CREATE INDEX IF NOT EXISTS idx_postlikes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_postlikes_user ON post_likes(user_id);


-- Indeks za komentare po postu
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- ==============================================================
--  KRAJ
-- ==============================================================

