# Alumni Club

Alumni Club is a monorepo containing both the frontend and backend for the project.

## Project Structure
- frontend/ → React + TypeScript (Vite)
- backend/  → Node.js + Express + PostgreSQL

## How to Run
### Frontend
cd frontend  
npm install  
npm run dev  
Runs on: http://localhost:5173

### Backend
cd backend  
npm install  
npm run dev  
Runs on: http://localhost:4000

## Latest Update
- Backend login fully implemented (JWT, bcrypt, roles)
- Role-based access: alumni + admin
- Protected API routes under /api/*
- Frontend successfully connected to backend login
- Test users added to database

## Test Accounts
alumni_one / AlumniPass1!  
alumni_two / AlumniPass2!  
admin_one / AdminPass1!
