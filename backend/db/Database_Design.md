# 🎓 Alumni Klub — Dokumentacija baze podataka

**Autori:** Filip Čokovski, Milija Knežević  
**Baza:** PostgreSQL (`alumni_club_dev`)  
**Datum kreiranja:** 27.10.2025.  
**Poslednja izmena:** 29.10.2025.  

---

## 🧩 1. Uvod

Ovaj dokument opisuje strukturu baze podataka za web aplikaciju **Alumni Klub**.  
Baza je dizajnirana tako da omogući:
- komunikaciju između članova alumnija,
- objavljivanje i komentarisanje postova,
- organizaciju i prijavu na događaje,
- slanje privatnih poruka,
- i diferencijaciju korisnika po ulozi (alumni / admin).

---

## 🏗️ 2. Pregled šeme baze

| Tabela | Opis |
|--------|------|
| **users** | Sadrži sve korisnike (alumni i administratore) |
| **posts** | Objave koje korisnici kreiraju |
| **comments** | Komentari na objave |
| **events** | Događaji koje kreiraju korisnici ili administratori |
| **event_registration** | Povezuje korisnike sa događajima na koje su prijavljeni |
| **private_messages** | Privatne poruke između korisnika |
| **post_likes** | Lajkovi koje korisnici ostavljaju na objavama |

---

## 🧱 3. Detalji entiteta

### 👤 **users**

| Kolona | Tip | Opis |
|---------|------|------|
| id | SERIAL | Primarni ključ |
| first_name | VARCHAR(100) | Ime korisnika |
| last_name | VARCHAR(100) | Prezime korisnika |
| email | VARCHAR(255), UNIQUE | Email adresa korisnika |
| password_hash | TEXT | Sažetak (heš) lozinke |
| role | VARCHAR(20), DEFAULT 'alumni' | Uloga korisnika (alumni / admin) |
| username | VARCHAR(30) | Korisničko ime |
| profile_picture | TEXT | URL slike profila |
| enrollment_year | INT | Godina upisa na fakultet |
| occupation | VARCHAR(255) | Trenutna profesija |
| is_active | BOOLEAN, DEFAULT TRUE | Status naloga |
| created_at | TIMESTAMP | Datum kreiranja |
| updated_at | TIMESTAMP | Datum poslednje izmene |

**Trigger:**  
- `set_users_updated_at` — automatski ažurira kolonu `updated_at` pri svakoj izmeni reda.

### 📝 **posts**

| Kolona | Tip | Opis |
|---------|------|------|
| id | SERIAL | Primarni ključ |
| user_id | INT | Strani ključ → `users.id` |
| content | TEXT | Sadržaj objave |
| image_url | TEXT | URL slike (opciono) |
| created_at | TIMESTAMP | Datum kreiranja |
| updated_at | TIMESTAMP | Datum poslednje izmene |

**Trigger:** `set_posts_updated_at`

### 💬 **comments**

| Kolona | Tip | Opis |
|---------|------|------|
| id | SERIAL | Primarni ključ |
| post_id | INT | Strani ključ → `posts.id` |
| user_id | INT | Strani ključ → `users.id` |
| content | TEXT | Tekst komentara |
| created_at | TIMESTAMP | Datum kreiranja |
| updated_at | TIMESTAMP | Datum poslednje izmene |

**Trigger:** `set_comments_updated_at`

### 📅 **events**

| Kolona | Tip | Opis |
|---------|------|------|
| id | SERIAL | Primarni ključ |
| title | VARCHAR(255) | Naziv događaja |
| description | TEXT | Opis događaja |
| location | VARCHAR(255) | Lokacija održavanja |
| start_time | TIMESTAMP | Početak događaja |
| end_time | TIMESTAMP | Kraj događaja |
| created_by | INT | Strani ključ → `users.id` |
| created_at | TIMESTAMP | Datum kreiranja |
| updated_at | TIMESTAMP | Datum poslednje izmene |

**Trigger:** `set_events_updated_at`

### ✉️ **private_messages**

| Kolona | Tip | Opis |
|---------|------|------|
| id | SERIAL | Primarni ključ |
| subject | VARCHAR(255) | Naslov poruke |
| content | TEXT | Sadržaj poruke |
| sent_date | TIMESTAMP | Datum slanja |
| read_at | TIMESTAMP | Datum čitanja poruke |
| sender_id | INT | Strani ključ → `users.id` |
| receiver_id | INT | Strani ključ → `users.id` |

**Trigger:** `set_private_messages_updated_at`

### ❤️ **post_likes**

| Kolona | Tip | Opis |
|---------|------|------|
| id | SERIAL | Primarni ključ |
| post_id | INT | Strani ključ → `posts.id` |
| user_id | INT | Strani ključ → `users.id` |
| created_at | TIMESTAMP | Datum lajkovanja |

### 🧾 **event_registration**

| Kolona | Tip | Opis |
|---------|------|------|
| id | SERIAL | Primarni ključ |
| event_id | INT | Strani ključ → `events.id` |
| user_id | INT | Strani ključ → `users.id` |
| registered_at | TIMESTAMP | Datum prijave |
| UNIQUE(user_id, event_id) | Sprečava duplu prijavu korisnika na isti događaj |

---

## ⚙️ 4. Funkcije i triggeri

### Funkcija
```sql
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
