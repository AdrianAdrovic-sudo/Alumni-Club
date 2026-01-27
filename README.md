# Alumni Club Platform

A full-stack alumni management platform built with React + TypeScript frontend and Node.js + Express + Prisma backend.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Icons** for icons

### Backend
- **Node.js** with Express
- **TypeScript**
- **Prisma** ORM with PostgreSQL
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

# 1. Backend Setup


### Navigate to backend directory
```
cd backend
```
### Install dependencies
```
npm install
```

## Set up environment variables
### Create .env file in backend/ with: 
```
DATABASE_URL="postgresql://username:password@localhost:5432/alumni_club_dev?schema=public"
PORT=4000
NODE_ENV=development
JWT_SECRET="your_jwt_secret"
PRISMA_LOG_LEVEL=info
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=????????????
FROM_EMAIL=fit.alumni.club@gmail.com      
ENROLL_TO=fit.alumni.club@gmail.com
CONTACT_INBOX_EMAIL=fit.alumni.club@gmail.com
```
# 

## Set up environment variables
### Create .env file in frontend/ with: 
```

VITE_TINYMCE_API_KEY=qkcx67femxnaq01itdjrlnliucc2at403pzwt57aici7njws
```
# 

### Set up database
```
npx prisma db pull
npx prisma generate
npx prisma db push
```

### Start the backend server
```
npm run dev
```

### Backend will run on ``` http://localhost:4000 ```

# 2. Frontend Setup

### Navigate to frontend directory (in a new terminal)
```
cd frontend
```

### Install dependencies
```
npm install
```

### Start the development server
```
npm run dev
```
### Frontend will run on ``` http://localhost:5173 ```

# 🔐 Authentication

### The platform uses JWT-based authentication:
    Login: POST /api/auth/login with username and password
    Protected Routes: Admin dashboard requires admin role
    Auto-logout: Token expiration after 1 hours

### Default Admin user
#### To create an admin user, run the admin creation script:
```
# From backend directory
npx ts-node src/scripts/create-admin.ts
```
#### Or use the interactive version:
```
npx ts-node src/scripts/create-admin-interactive.ts
```
# 📊 API Endpoints
#### Authentication

    POST /api/auth/login - User login

#### Alumni Management

    GET /api/alumni - Get all alumni members

    GET /api/alumni/:id - Get specific alumni

#### Health Check

    GET /api/health - Check API status


