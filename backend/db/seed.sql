
--Dodavanje korisnika--

INSERT INTO users (first_name, last_name, email, password_hash, username, enrollment_year)
VALUES
('Ana', 'Petrović', 'ana@example.com', 'ana123', 'anapetrovic', 2020),
('Marko', 'Jovanović', 'marko@example.com', 'marko123', 'markoj', 2019),
('Ivana', 'Kovačević', 'ivana@example.com', 'ivana123', 'ivanak', 2021),
('Nikola', 'Stanić', 'nikola@example.com', 'nikola123', 'nikstanic', 2022),
('Jelena', 'Milić', 'jelena@example.com', 'jelena123', 'jmilic', 2020),
('Petar', 'Vuković', 'petar@example.com', 'petar123', 'pvuk', 2018),
('Milica', 'Đorđević', 'milica@example.com', 'milica123', 'mdjordj', 2023),
('Luka', 'Radović', 'luka@example.com', 'luka1234', 'lukar', 2024);

 --Postovi--

INSERT INTO posts (user_id, content)
VALUES
(1, 'Pozdrav svima, drago mi je da sam ovde!'),
(2, 'Završio sam kurs iz React-a, preporuka!'),
(3, 'Ko ide na alumni okupljanje sledeće nedelje?');

 --Komentari--

INSERT INTO comments (post_id, user_id, content)
VALUES
(1, 2, 'Dobrodošla Ana!'),
(2, 3, 'Bravo Marko!'),
(3, 1, 'Ja dolazim sigurno!');

--Dogadjaji--

INSERT INTO event (title, description, location, start_time, end_time, created_by)
VALUES
('Alumni Meetup', 'Druženje bivših studenata', 'Podgorica', '2025-11-10 18:00', '2025-11-10 21:00', 1),
('Tech Talk', 'Predavanje o novim tehnologijama', 'Nikšić', '2025-12-01 17:00', '2025-12-01 19:00', 2);

--Registracija--

INSERT INTO event_registration (event_id, user_id, status)
VALUES
(1, 3, 'confirmed'),
(1, 4, 'confirmed'),
(2, 5, 'pending');

--privatne poruke--

INSERT INTO private_message (subject, content, sender, receiver)
VALUES
('Pozdrav', 'Ćao Ivana, kako si?', 1, 3),
('Re: Pozdrav', 'Ćao Ana, sve super! Ti?', 3, 1),
('Pitanje', 'Da li ideš na Tech Talk?', 2, 5);


