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

-- USERS tabela
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

-- POSTS tabela
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  image_url TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- COMMENTS tabela
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

create table event(
	id SERIAL primary key,
	title VARCHAR(255) not null,
	description TEXT,
	location VARCHAR(255),
	start_time timestamp not null,
	end_time timestamp not null,
	created_by INT not null,
	updated_at TIMESTAMP default now(),
	foreign key (created_by) references users(id) on delete cascade
);

create table private_message(
	id SERIAL primary key,
	subject VARCHAR(255) not null,
	content TEXT not null,
	sent_date timestamp default now(),
	is_read BOOLEAN default false,
	sender INT not null,
	receiver INT not null,
	foreign key (sender) references users(id) on delete cascade,
	foreign key (receiver) references users(id) on delete cascade
);

CREATE TRIGGER set_posts_updated_at
BEFORE UPDATE ON event
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

CREATE TRIGGER set_comments_updated_at
BEFORE UPDATE ON private_message
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

create table event_registration(
	id SERIAL primary key,
	event_id INT not null,
	user_id INT not null,
	registered_at timestamp default now(),
	status VARCHAR(255) not null,
	foreign key(event_id) references event(id) on delete cascade,
	foreign key(user_id) references users(id) on delete cascade
);

CREATE TRIGGER set_comments_updated_at
BEFORE UPDATE ON event_registration
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_column();

