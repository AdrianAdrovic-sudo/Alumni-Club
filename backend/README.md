# 🎓 Alumni Club – Backend

## 📘 Overview

This is the **backend service** for the **Alumni Club** project, developed as part of Sprint 1.  
It provides the foundation for a modular, scalable API built with **Node.js**, **Express**, and **TypeScript**.

At this stage, the backend is fully structured and functional, using **mock in-memory repositories** to simulate database operations.  
The architecture is complete — routes, middlewares, validation, error handling, and CI/CD are all active — awaiting connection to the real database.

---

## 🧩 Current Features

✅ **Express + TypeScript setup**  
✅ **Mock repositories** for users, alumni, news, and blogs  
✅ **Authentication system (mock data)**  
✅ **Rate limiting**, **Helmet**, **CORS**, and **Compression** middleware  
✅ **Request ID** and structured **logging**  
✅ **Swagger (OpenAPI)** documentation  
✅ **Zod validation layer**  
✅ **Error handling** with friendly responses  
✅ **GitHub Actions CI** (linting, type checking, build verification)

---

## 🗂️ Project Structure

backend/
│
├── src/
│ ├── config/ # Swagger setup, environment config
│ ├── middlewares/ # Security, request ID, error handlers, rate limiter
│ ├── repositories/ # Mock in-memory data stores
│ ├── routes/ # Express route modules
│ ├── schemas/ # Zod validation schemas
│ ├── tests/ # Jest tests
│ ├── utils/ # Logger and helpers
│ └── validations/ # App + server entry points
│
├── .github/workflows/ # CI pipeline
├── package.json
├── tsconfig.json
└── README.md

---

## ⚙️ Technology Stack

- **Language:** TypeScript
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Validation:** Zod
- **Documentation:** Swagger UI
- **Testing:** Jest (basic setup)
- **Linting:** ESLint v9 (flat config)
- **CI/CD:** GitHub Actions

---

##Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-org-or-user>/Alumni-Club.git
cd Alumni-Club/backend

2️⃣ Install dependencies

npm install

3️⃣ Build the TypeScript code

npm run build

4️⃣ Start the development server

npm run dev

Server runs at:

http://localhost:3000

🧭 Available Routes
Endpoint	Method	Description
/api/health	GET	Check if the API is running
/api/version	GET	Get current API version
/api/users	GET	Get all mock users
/api/alumni	GET	Get all mock alumni
/api/news	GET	Get mock news
/api/blogs	GET	Get mock blogs
/api/auth/register	POST	Mock register
/api/auth/login	POST	Mock login

Swagger Docs → http://localhost:3000/api-docs

🧠 Future Development
Introduce a real database (PostgreSQL / MySQL)

Implement ORM (Prisma or TypeORM)

Replace mock repositories with persistent models

Expand CRUD operations for all entities

🧑‍💻 Team Guidelines
Always branch from main

Follow the naming pattern: feature/..., fix/..., or chore/...

Ensure CI passes before opening a pull request

Keep commits descriptive and atomic

🏁 Status
✅ Sprint 1 complete – backend foundation ready
🕓 Next milestone: Connect to the real database and implement CRUD

🏁 Sprint 2

✅ Added user-friendly error messages
✅ Implemented rate limiter for login attempts
✅ Integrated Swagger documentation for Auth API
```
