## **backend/README.md**

```markdown
# Alumni Club – Backend

Backend deo projekta **Alumni Club**, razvijen u **Node.js + Express + TypeScript**.

## Pokretanje projekta

cd backend
npm install
npm run dev

Server će se pokrenuti na:
http://localhost:3000

Struktura
backend/
│
├── src/
│ ├── routes/ # Modularne rute (npr. health, users, news)
│ ├── middlewares/ # Error handler, not found, sigurnosni slojevi
│ ├── utils/ # Logger, pomoćne funkcije
│ ├── config/ # Povezivanje sa bazom, okruženje
│ ├── app.ts # Express aplikacija
│ └── server.ts # Ulazna tačka servera
│
├── .env.example # Šablon konfiguracije
├── package.json # Skripte i zavisnosti
└── tsconfig.json # TypeScript konfiguracija

Implementirano (Sprint 1)

Osnovna projektna struktura (src/, config/, routes/)

Express server sa CORS, Helmet i JSON parsingom

Health i Version API rute

Globalni error handler i 404 odgovor

Logger (pino)

Sledeće faze

Konekcija sa bazom (ORM – Prisma ili TypeORM)

CRUD operacije za korisnike, vesti, blogove

Autentifikacija i RBAC

Swagger dokumentacija i CI pipeline

---

Dodata Swagger (OpenAPI) dokumentacija:

-Podešen `swagger-ui-express` i `swagger-jsdoc`
-Kreiran `src/config/swagger.ts`
-Integrisan Swagger u `app.ts` (ruta `/api/docs`)
-Dokumentovane rute `/health` i `/version`

Dokumentacija dostupna na:
(http://localhost:3000/api/docs)
```

Validacija podataka (Zod middleware)

Implementirana je validacija unosa pomoću biblioteke Zod, kroz prilagođeni Express middleware.

dodata struktura
src/
├── middlewares/
│ └── validate.ts # Middleware za validaciju pomoću Zod šema
├── validations/
│ └── auth.validation.ts # Šeme za registraciju i login
├── routes/
│ └── auth.ts # Rute koje koriste validaciju (register, login)

In-memory repositories i mock data

U ovoj fazi implementirani su jednostavni in-memory repozitorijumi (privremena baza podataka u memoriji) koji koriste statičke .json fajlove kao početne podatke.
Ovi fajlovi se učitavaju pri pokretanju servera i omogućavaju testiranje API-ja bez prave baze podataka.
dodata struktura
backend/
├── seed/ # Staticki .json fajlovi (mock podaci)
│ ├── users.json
│ ├── alumni.json
│ ├── news.json
│ └── blogs.json
│
├── src/
│ ├── repositories/ # Privremeni "repozitorijumi" koji čuvaju podatke u memoriji
│ │ ├── usersRepo.ts
│ │ ├── alumniRepo.ts
│ │ ├── newsRepo.ts
│ │ └── blogsRepo.ts
│ │
│ ├── routes/ # API rute
│ │ ├── users.ts # /api/users – vraća i dodaje korisnike
│ │ ├── health.ts
│ │ ├── auth.ts
│ │ └── index.ts
│ │
│ ├── app.ts
│ └── server.ts # Učitava mock podatke pre starta servera

Autentifikacija (JWT + bcrypt)

Implementiran kompletan auth sistem sa sledećim funkcionalnostima:

Registracija korisnika (POST /api/auth/register)
→ Validacija unosa, hashiranje lozinke i kreiranje korisnika.

Prijava korisnika (POST /api/auth/login)
→ Provera kredencijala, generisanje JWT tokena pomoću jsonwebtoken.

Zaštićena ruta (GET /api/auth/me)
→ Dostupna samo uz validan token.

Sigurnosni mehanizmi:

bcryptjs za šifrovanje lozinki

jsonwebtoken za autentifikaciju

.env fajl za čuvanje tajnih ključeva

Middleware requireAuth za proveru tokena

Feature routes with filters and pagination (mocked)
dodate su rute za alumni, news i blogs sa filtriranjem, sortiranjem i paginacijom mock podataka iz memorije.

Testiranje middleware-a (x-request-id i Rate Limiter)

U ovom koraku su implementirana i testirana dva ključna Express middleware-a:

1. x-request-id

Dodaje jedinstveni identifikator svakom API zahtevu pomoću crypto.randomUUID().
Ovaj ID se vraća u response headeru pod imenom x-request-id.
Koristi se za praćenje i dijagnostiku zahteva u logovima.
Testirano komandama Invoke-WebRequest i curl -I, header se uspešno prikazuje.

2. authRateLimiter

Sprečava prekomerno slanje zahteva prema rutama /api/auth.
Ograničenje: maksimalno 5 zahteva u 1 minutu po IP adresi.
Pri prekoračenju, API vraća previse pokusaja
