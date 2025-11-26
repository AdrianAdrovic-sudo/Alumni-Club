import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { CreateUserInput, UpdateUserInput, UserFilters } from '../types/admin.types';

export class AdminController {
  // User Management
  static async getUsers(req: Request, res: Response) {
    try {
      const { role, enrollment_year, is_active, search, page = 1, limit = 10 } = req.query;
      
      const filters: UserFilters = {};
      if (role) filters.role = role as string;
      if (enrollment_year) filters.enrollment_year = parseInt(enrollment_year as string);
      if (is_active !== undefined) filters.is_active = is_active === 'true';
      if (search) filters.search = search as string;

      const result = await AdminService.getAllUsers(
        filters, 
        parseInt(page as string), 
        parseInt(limit as string)
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: (error as Error).message });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await AdminService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: (error as Error).message });
    }
  }

  // In admin.controller.ts - IMPROVED VERSION
static async createUser(req: Request, res: Response) {
  try {
    const userData: CreateUserInput = req.body;
    console.log('Creating user with data:', userData);
    
    const newUser = await AdminService.createUser(userData);
    
    console.log('User created successfully:', newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Detailed error creating user:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: (error as Error).message,
      // Add stack trace in development
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  }
}

  static async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const userData: UpdateUserInput = req.body;
      
      const updatedUser = await AdminService.updateUser(userId, userData);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      await AdminService.deleteUser(userId);
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
    }
  }

  static async deactivateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      await AdminService.deactivateUser(userId);
      
      res.json({ message: 'User deactivated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deactivating user', error: (error as Error).message });
    }
  }

  static async activateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      await AdminService.activateUser(userId);
      
      res.json({ message: 'User activated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error activating user', error: (error as Error).message });
    }
  }

  // Content Management
  static async getPosts(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await AdminService.getAllPosts(
        parseInt(page as string), 
        parseInt(limit as string)
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error: (error as Error).message });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      await AdminService.deletePost(postId);
      
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error: (error as Error).message });
    }
  }

  static async getEvents(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await AdminService.getAllEvents(
        parseInt(page as string), 
        parseInt(limit as string)
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error: (error as Error).message });
    }
  }

  // Analytics
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await AdminService.getPlatformStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching stats', error: (error as Error).message });
    }
  }
}