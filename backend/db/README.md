\# 🎓 Alumni Klub — Dokumentacija baze podataka



\*\*Autori:\*\* Filip Čokovski, Milija Knežević  

\*\*Baza:\*\* PostgreSQL (`alumni\_club\_dev`)  

\*\*Datum kreiranja:\*\* 27.10.2025.  

\*\*Poslednja izmena:\*\* 29.10.2025.  



---



\## 🧩 1. Uvod



Ovaj dokument opisuje strukturu baze podataka za web aplikaciju \*\*Alumni Klub\*\*.  

Baza je dizajnirana tako da omogući:

\- komunikaciju između članova alumnija,  

\- objavljivanje i komentarisanje postova,  

\- organizaciju i prijavu na događaje,  

\- slanje privatnih poruka,  

\- i diferencijaciju korisnika po ulozi (alumni / admin).



---



\## 🏗️ 2. Pregled šeme baze



| Tabela | Opis |

|--------|------|

| \*\*users\*\* | Sadrži sve korisnike (alumni i administratore) |

| \*\*posts\*\* | Objave koje korisnici kreiraju |

| \*\*comments\*\* | Komentari na objave |

| \*\*events\*\* | Događaji koje kreiraju korisnici ili administratori |

| \*\*event\_registration\*\* | Povezuje korisnike sa događajima na koje su prijavljeni |

| \*\*private\_messages\*\* | Privatne poruke između korisnika |

| \*\*post\_likes\*\* | Lajkovi koje korisnici ostavljaju na objavama |



---



\## 🧱 3. Detalji entiteta



\### 👤 \*\*users\*\*

| Kolona | Tip | Opis |

|---------|------|------|

| id | SERIAL | Primarni ključ |

| first\_name | VARCHAR(100) | Ime korisnika |

| last\_name | VARCHAR(100) | Prezime korisnika |

| email | VARCHAR(255), UNIQUE | Email adresa korisnika |

| password\_hash | TEXT | Sažetak (heš) lozinke |

| role | VARCHAR(20), DEFAULT 'alumni' | Uloga korisnika (alumni / admin) |

| username | VARCHAR(30) | Korisničko ime |

| profile\_picture | TEXT | URL slike profila |

| enrollment\_year | INT | Godina upisa na fakultet |

| occupation | VARCHAR(255) | Trenutna profesija |

| is\_active | BOOLEAN, DEFAULT TRUE | Status naloga |

| created\_at | TIMESTAMP | Datum kreiranja |

| updated\_at | TIMESTAMP | Datum poslednje izmene |



\*\*Trigger:\*\*  

\- `set\_users\_updated\_at` — automatski ažurira kolonu `updated\_at` pri svakoj izmeni reda.



---



\### 📝 \*\*posts\*\*

| Kolona | Tip | Opis |

|---------|------|------|

| id | SERIAL | Primarni ključ |

| user\_id | INT | Strani ključ → `users.id` |

| content | TEXT | Sadržaj objave |

| image\_url | TEXT | URL slike (opciono) |

| created\_at | TIMESTAMP | Datum kreiranja |

| updated\_at | TIMESTAMP | Datum poslednje izmene |



\*\*Trigger:\*\* `set\_posts\_updated\_at`



---



\### 💬 \*\*comments\*\*

| Kolona | Tip | Opis |

|---------|------|------|

| id | SERIAL | Primarni ključ |

| post\_id | INT | Strani ključ → `posts.id` |

| user\_id | INT | Strani ključ → `users.id` |

| content | TEXT | Tekst komentara |

| created\_at | TIMESTAMP | Datum kreiranja |

| updated\_at | TIMESTAMP | Datum poslednje izmene |



\*\*Trigger:\*\* `set\_comments\_updated\_at`



---



\### 📅 \*\*events\*\*

| Kolona | Tip | Opis |

|---------|------|------|

| id | SERIAL | Primarni ključ |

| title | VARCHAR(255) | Naziv događaja |

| description | TEXT | Opis događaja |

| location | VARCHAR(255) | Lokacija održavanja |

| start\_time | TIMESTAMP | Početak događaja |

| end\_time | TIMESTAMP | Kraj događaja |

| created\_by | INT | Strani ključ → `users.id` |

| created\_at | TIMESTAMP | Datum kreiranja |

| updated\_at | TIMESTAMP | Datum poslednje izmene |



\*\*Trigger:\*\* `set\_events\_updated\_at`



---



\### ✉️ \*\*private\_messages\*\*

| Kolona | Tip | Opis |

|---------|------|------|

| id | SERIAL | Primarni ključ |

| subject | VARCHAR(255) | Naslov poruke |

| content | TEXT | Sadržaj poruke |

| sent\_date | TIMESTAMP | Datum slanja |

| read\_at | TIMESTAMP | Datum čitanja poruke |

| sender\_id | INT | Strani ključ → `users.id` |

| receiver\_id | INT | Strani ključ → `users.id` |



\*\*Trigger:\*\* `set\_private\_messages\_updated\_at`



---



\### ❤️ \*\*post\_likes\*\*

| Kolona | Tip | Opis |

|---------|------|------|

| id | SERIAL | Primarni ključ |

| post\_id | INT | Strani ključ → `posts.id` |

| user\_id | INT | Strani ključ → `users.id` |

| created\_at | TIMESTAMP | Datum lajkovanja |



---



\### 🧾 \*\*event\_registration\*\*

| Kolona | Tip | Opis |

|---------|------|------|

| id | SERIAL | Primarni ključ |

| event\_id | INT | Strani ključ → `events.id` |

| user\_id | INT | Strani ključ → `users.id` |

| registered\_at | TIMESTAMP | Datum prijave |

| UNIQUE(user\_id, event\_id) | Sprečava duplu prijavu korisnika na isti događaj |



---



\## ⚙️ 4. Funkcije i triggeri



\### Funkcija

```sql

CREATE OR REPLACE FUNCTION set\_updated\_at\_column()

RETURNS TRIGGER AS $$

BEGIN

&nbsp; NEW.updated\_at = now();

&nbsp; RETURN NEW;

END;

$$ LANGUAGE plpgsql;



