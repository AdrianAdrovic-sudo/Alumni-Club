import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/auth.types';

const prisma = new PrismaClient();

class AuthController {
    async register(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password, // Ensure to hash the password before saving in production
                },
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'User registration failed' });
        }
    }

    async login(req: AuthRequest, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user || user.password !== password) { // Implement proper password hashing and comparison
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate and return a token (not implemented here)
            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    }

    async logout(req: AuthRequest, res: Response) {
        // Implement logout logic (e.g., invalidate token)
        res.status(200).json({ message: 'Logout successful' });
    }
}

export default new AuthController();