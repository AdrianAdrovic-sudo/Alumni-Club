import { Request, Response } from "express";
import prisma from "../prisma";
import fs from "fs";
import path from "path";

/**
 * GET /api/theses
 * Returns users who have a thesis uploaded OR have a placeholder title.
 */
export const getTheses = async (req: Request, res: Response) => {
    try {
        const theses = await prisma.users.findMany({
            where: {
                role: "user", // Fetch all alumni/students
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                thesis_title: true,
                thesis_document_url: true,
                thesis_type: true,
                defense_date: true,
            },
            orderBy: [
                { defense_date: "desc" },
                { created_at: "desc" }
            ],
        });

        return res.json(theses);
    } catch (error) {
        console.error("Error fetching theses:", error);
        return res.status(500).json({ message: "Server error while fetching theses" });
    }
};

/**
 * DELETE /api/theses/:id
 * Removes the thesis file and resets database fields for the user.
 */
export const deleteThesis = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const user = await prisma.users.findUnique({
            where: { id },
            select: { thesis_document_url: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the physical file if it exists
        if (user.thesis_document_url) {
            const filePath = path.join(__dirname, "..", "..", user.thesis_document_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Update the database
        await prisma.users.update({
            where: { id },
            data: {
                thesis_document_url: null,
                thesis_title: "/",
            },
        });

        return res.json({ message: "Thesis deleted successfully" });
    } catch (error) {
        console.error("Error deleting thesis:", error);
        return res.status(500).json({ message: "Server error while deleting thesis" });
    }
};

/**
 * POST /api/theses/upload/:id
 * Handles uploading a thesis for a specific user.
 */
export const uploadThesisHandler = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const { title, thesisType, defenseDate } = req.body;
        const file = req.file;

        console.log("Upload Thesis Request:", {
            userId,
            body: req.body,
            file: file ? { filename: file.filename, size: file.size } : "no file"
        });

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const thesis_document_url = `/uploads/theses/${file.filename}`;

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                thesis_title: title || "/",
                thesis_type: thesisType,
                defense_date: defenseDate ? new Date(defenseDate) : null,
                thesis_document_url: thesis_document_url,
            },
        });

        return res.json({ message: "Thesis uploaded successfully", user: updatedUser });
    } catch (error) {
        console.error("Error uploading thesis:", error);
        return res.status(500).json({ message: "Server error while uploading thesis" });
    }
};
