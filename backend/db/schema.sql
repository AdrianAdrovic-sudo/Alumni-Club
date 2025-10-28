CREATE DATABASE alumni_club_dev;

\c alumni_club_dev;

-- Funkcija za update tabela --
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL UNIQUE,
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

CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
  image_url TEXT,
  FOREIGN KEY user_id REFERENCES User(id) ON DELETE CASCADE;
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY post_id REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY user_id REFERENCES user(id) ON DELETE CASCADE
);


-- Triggeri --
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

CREATE TRIGGER set_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

CREATE TRIGGER set_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();


