import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Here you would verify the token and extract user information
        // For example, using a JWT library to decode the token
        const user = await verifyToken(token); // Implement this function based on your auth strategy

        // Attach user information to the request object
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// Example function to verify token (you need to implement this)
async function verifyToken(token: string) {
    // Logic to verify the token and return user information
    // This is just a placeholder
    return { id: 1, name: 'John Doe' }; // Replace with actual user data
}