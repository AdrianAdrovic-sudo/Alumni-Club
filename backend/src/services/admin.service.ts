import { PrismaClient } from '@prisma/client';
import { CreateUserInput, UpdateUserInput, UserFilters } from '../types/admin.types';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class AdminService {
  // User Management
  static async getAllUsers(filters: UserFilters = {}, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters.role) where.role = filters.role;
    if (filters.enrollment_year) where.enrollment_year = filters.enrollment_year;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;
    
    if (filters.search) {
      where.OR = [
        { first_name: { contains: filters.search, mode: 'insensitive' } },
        { last_name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { username: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          username: true,
          role: true,
          enrollment_year: true,
          occupation: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              posts: true,
              comments: true,
              event_registration: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.users.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getUserById(userId: number) {
    return prisma.users.findUnique({
      where: { id: userId },
      include: {
        posts: {
          take: 5,
          orderBy: { created_at: 'desc' }
        },
        event_registration: {
          include: {
            events: true
          },
          take: 5
        },
        _count: {
          select: {
            posts: true,
            comments: true,
            event_registration: true
          }
        }
      }
    });
  }

  static async createUser(userData: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    return prisma.users.create({
      data: {
        ...userData,
        password_hash: hashedPassword,
        role: userData.role || 'user'
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
        role: true,
        enrollment_year: true,
        occupation: true,
        is_active: true,
        created_at: true
      }
    });
  }

  static async updateUser(userId: number, userData: UpdateUserInput) {
    return prisma.users.update({
      where: { id: userId },
      data: userData,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        username: true,
        role: true,
        enrollment_year: true,
        occupation: true,
        is_active: true,
        updated_at: true
      }
    });
  }

  static async deleteUser(userId: number) {
    return prisma.users.delete({
      where: { id: userId }
    });
  }

  static async deactivateUser(userId: number) {
    return prisma.users.update({
      where: { id: userId },
      data: { is_active: false }
    });
  }

  static async activateUser(userId: number) {
    return prisma.users.update({
      where: { id: userId },
      data: { is_active: true }
    });
  }

  // Content Management
  static async getAllPosts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      prisma.posts.findMany({
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              username: true
            }
          },
          _count: {
            select: {
              comments: true,
              post_likes: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.posts.count()
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async deletePost(postId: number) {
    return prisma.posts.delete({
      where: { id: postId }
    });
  }

  static async getAllEvents(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      prisma.events.findMany({
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              username: true
            }
          },
          _count: {
            select: {
              event_registration: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { start_time: 'desc' }
      }),
      prisma.events.count()
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Analytics
  static async getPlatformStats() {
    const [
      totalUsers,
      activeUsers,
      totalPosts,
      totalEvents,
      totalComments,
      recentRegistrations
    ] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { is_active: true } }),
      prisma.posts.count(),
      prisma.events.count(),
      prisma.comments.count(),
      prisma.users.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalPosts,
      totalEvents,
      totalComments,
      recentRegistrations
    };
  }
}