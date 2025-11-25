import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (data) => {
    try {
        const user = await prisma.user.create({
            data,
        });
        return user;
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
};

export const loginUser = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Add password verification logic here
        return user;
    } catch (error) {
        throw new Error('Error logging in: ' + error.message);
    }
};

export const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

export const updateUser = async (id, data) => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data,
        });
        return user;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};

export const deleteUser = async (id) => {
    try {
        await prisma.user.delete({
            where: { id },
        });
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
};