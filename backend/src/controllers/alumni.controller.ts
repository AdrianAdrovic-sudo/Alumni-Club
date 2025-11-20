import { Request, Response } from "express";
import { getAllAlumni, getAlumniById } from "../services/alumni.service";

export async function getAlumni(req: Request, res: Response) {
  try {
    const search = req.query.search as string | undefined;
    const alumni = await getAllAlumni(search);
    res.json(alumni);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getOneAlumni(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const alumni = await getAlumniById(id);

    if (!alumni) return res.status(404).json({ error: "Not found" });

    res.json(alumni);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}