
---

## **backend/README.md** 

```markdown
#  Alumni Club – Backend

Backend deo projekta **Alumni Club**, razvijen u **Node.js + Express + TypeScript**.

##  Pokretanje projekta

cd backend
npm install
npm run dev

Server će se pokrenuti na:
 http://localhost:3000

Struktura
backend/
│
├── src/
│   ├── routes/         # Modularne rute (npr. health, users, news)
│   ├── middlewares/    # Error handler, not found, sigurnosni slojevi
│   ├── utils/          # Logger, pomoćne funkcije
│   ├── config/         # Povezivanje sa bazom, okruženje
│   ├── app.ts          # Express aplikacija
│   └── server.ts       # Ulazna tačka servera
│
├── .env.example        # Šablon konfiguracije
├── package.json        # Skripte i zavisnosti
└── tsconfig.json       # TypeScript konfiguracija

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
