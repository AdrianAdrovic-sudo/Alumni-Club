-- ==============================================================
--  USERS
-- ==============================================================

INSERT INTO users (first_name, last_name, email, password_hash, role, username, profile_picture, enrollment_year, is_active, occupation)
VALUES
('Marko', 'Marković', 'marko@example.com', 'hash1', 'admin', 'marko_admin', NULL, 2015, TRUE, 'Software Developer'),
('Jelena', 'Jovanović', 'jelena@example.com', 'hash2', 'alumni', 'jelena_j', NULL, 2016, TRUE, 'Marketing Specialist'),
('Petar', 'Petrović', 'petar@example.com', 'hash3', 'alumni', 'petar_p', NULL, 2014, TRUE, 'Project Manager'),
('Ana', 'Anić', 'ana@example.com', 'hash4', 'alumni', 'ana_a', NULL, 2017, TRUE, 'UX Designer'),
('Nikola', 'Nikolić', 'nikola@example.com', 'hash5', 'alumni', 'nikola_n', NULL, 2015, TRUE, 'Data Analyst'),
('Sara', 'Sarić', 'sara@example.com', 'hash6', 'alumni', 'sara_s', NULL, 2018, TRUE, 'HR Specialist'),
('Ivan', 'Ivić', 'ivan@example.com', 'hash7', 'alumni', 'ivan_i', NULL, 2019, TRUE, 'Software Engineer'),
('Mila', 'Milić', 'mila@example.com', 'hash8', 'alumni', 'mila_m', NULL, 2016, TRUE, 'Accountant'),
('Luka', 'Lukić', 'luka@example.com', 'hash9', 'alumni', 'luka_l', NULL, 2015, TRUE, 'Entrepreneur'),
('Tanja', 'Tanjić', 'tanja@example.com', 'hash10', 'alumni', 'tanja_t', NULL, 2017, TRUE, 'Graphic Designer');


-- ==============================================================
--  POSTS
-- ==============================================================

INSERT INTO posts (user_id, content, image_url)
VALUES
(1, 'Pozdrav svima! Ovo je prvi post na mreži.', NULL),
(2, 'Upravo sam završila novi projekt, jako sam ponosna!', NULL),
(3, 'Ima li neko preporuku za dobar online kurs menadžmenta?', NULL),
(4, 'Danas radim na novom UI dizajnu. Evo jednog previewa!', 'https://example.com/ui.png'),
(1, 'Ako nekoga zanima backend development, slobodno se javite.', NULL),
(5, 'Data science je sve zanimljiviji iz dana u dan!', NULL),
(7, 'Softverski inženjering je super karijera, preporučujem svima!', NULL);


-- ==============================================================
--  COMMENTS
-- ==============================================================

INSERT INTO comments (post_id, user_id, content)
VALUES
(1, 2, 'Bravo Marko!'),
(1, 3, 'Odličan početak!'),
(2, 1, 'Svaka čast Jelena!'),
(3, 4, 'Preporučujem Udemy ili Coursera.'),
(4, 6, 'Sjajno izgleda!'),
(6, 7, 'Potpuno se slažem!'),
(7, 5, 'Odlična perspektiva!');


-- ==============================================================
--  POST_LIKES
-- ==============================================================

INSERT INTO post_likes (post_id, user_id)
VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 4),
(4, 6),
(5, 7),
(6, 5),
(7, 8);


-- ==============================================================
--  PRIVATE_MESSAGES
-- ==============================================================

INSERT INTO private_messages (subject, content, sender_id, receiver_id)
VALUES
('Pozdrav', 'Hej Marko, možemo li se čuti oko projekta?', 2, 1),
('Re: Pozdrav', 'Naravno Jelena, javi kada možeš!', 1, 2),
('Pitanje', 'Da li imaš iskustva sa data science kursevima?', 6, 5),
('Dogovor', 'Vidimo se sutra u 10h.', 3, 4);


-- ==============================================================
--  EVENTS
-- ==============================================================

INSERT INTO events (title, description, location, start_time, end_time, created_by)
VALUES
('Alumni Meetup 2025', 'Godišnje okupljanje svih bivših studenata.', 'Beograd', '2025-05-20 18:00', '2025-05-20 21:00', 1),
('Tech Konferencija', 'Predavanja iz oblasti IT industrije.', 'Novi Sad', '2025-06-10 09:00', '2025-06-10 17:00', 5),
('Startup Networking', 'Povezivanje mladih preduzetnika.', 'Niš', '2025-04-15 17:00', '2025-04-15 20:00', 9);


-- ==============================================================
--  EVENT_REGISTRATION
-- ==============================================================

INSERT INTO event_registration (event_id, user_id)
VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 5),
(3, 7),
(3, 8),
(3, 9);
