import { Request, Response } from "express";
import * as thesisService from "../services/theses.service";

export const getTheses = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (req.query.search as string) || "";
        const type = (req.query.type as string) || "all";
        const sortBy = (req.query.sortBy as string) || "defense_date";
        const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

        const result = await thesisService.getAllTheses(
            { search, type },
            page,
            limit,
            sortBy,
            sortOrder
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const createThesis = async (req: Request, res: Response) => {
    try {
        const newThesis = await thesisService.createThesis(req.body);
        res.status(201).json(newThesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getThesis = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const thesis = await thesisService.getThesisById(id);
        if (!thesis) {
            return res.status(404).json({ message: "Thesis not found" });
        }
        res.json(thesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateThesis = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const updatedThesis = await thesisService.updateThesis(id, req.body);
        res.json(updatedThesis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteThesis = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await thesisService.deleteThesis(id);
        res.json({ message: "Thesis deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
