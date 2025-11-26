import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// User Management
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUser);
router.post('/users', AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);
router.patch('/users/:id/deactivate', AdminController.deactivateUser);
router.patch('/users/:id/activate', AdminController.activateUser);

// Content Management
router.get('/posts', AdminController.getPosts);
router.delete('/posts/:id', AdminController.deletePost);
router.get('/events', AdminController.getEvents);

// Analytics
router.get('/stats', AdminController.getStats);

export default router;