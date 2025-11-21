# Alumni Club Backend

Backend for Alumni Club project.  
Built with Node.js, Express, TypeScript, PostgreSQL.

## Setup
cd backend  
npm install  

Create .env with:
DATABASE_URL=your_connection_string  
JWT_SECRET=secret  
JWT_EXPIRES_IN=7d  
PORT=4000  

Run DB setup:
psql "YOUR_DB_URL" -f db/schema.sql  
Insert test users manually (bcrypt hashes already generated)

Start server:
npm run dev  
Runs on http://localhost:4000

## Latest Update
- Added full login system (JWT + bcrypt)
- Added requireAuth and requireRole middleware
- Protected alumni routes under /api/alumni
- Admin-only route examples added
