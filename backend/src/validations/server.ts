// backend/src/validations/server.ts
import dotenv from 'dotenv';
import app from './app';

import { loadUsers } from '../repositories/usersRepo';
import { loadAlumni } from '../repositories/alumniRepo';
import { loadNews } from '../repositories/newsRepo';
import { loadBlogs } from '../repositories/blogsRepo';

dotenv.config();

loadUsers();
loadAlumni();
loadNews();
loadBlogs();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
