# Alumni Club Backend

This is the backend for the Alumni Club project.  
Built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.

### Setup
1. Go to the backend folder:
   ```bash
   cd backend
   
Install dependencies:
npm install
Create .env (see .env.example) with your database URL.

Run the database scripts:
psql -U postgres -d alumni_club_dev -f ./db/schema.sql
psql -U postgres -d alumni_club_dev -f ./db/seed.sql

Start the server:
npm run dev

Test
Health check: http://localhost:4000/api/health
Database check: http://localhost:4000/api/health/db
