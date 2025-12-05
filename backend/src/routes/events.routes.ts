import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { EventVisibility, EventStatus } from "../types/enums";

const prisma = new PrismaClient();
const router = Router();

// --- Zod schema za validaciju ---
const eventSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  timezone: z.string(),
  location: z.string(),
  venue_id: z.number().nullable(),
  capacity: z.number().nullable(),
  visibility: z.nativeEnum(EventVisibility),
  status: z.nativeEnum(EventStatus),
});

// --- POST /api/events (admin only) ---
router.post("/", authenticate, requireAdmin, async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

  try {
    const event = await prisma.events.create({
      data: { ...parsed.data, created_by: req.user!.id },
    });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- GET /api/events ---
router.get("/", async (req, res) => {
  const { status, startDate, endDate, search } = req.query;

  try {
    const events = await prisma.events.findMany({
      where: {
        status: status ? (status as any) : undefined,
        start_time: startDate ? { gte: new Date(startDate as string) } : undefined,
        end_time: endDate ? { lte: new Date(endDate as string) } : undefined,
        OR: search
          ? [
              { title: { contains: search as string, mode: "insensitive" } },
              { description: { contains: search as string, mode: "insensitive" } },
            ]
          : undefined,
      },
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- GET /api/events/:id ---
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const event = await prisma.events.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- PATCH /api/events/:id (admin only) ---
router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = eventSchema.partial().safeParse(req.body); // partial za update
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

  try {
    const updated = await prisma.events.update({
      where: { id },
      data: parsed.data,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error or event not found" });
  }
});

// --- DELETE /api/events/:id (admin only, soft delete) ---
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const deleted = await prisma.events.update({
      where: { id },
      data: { status: "Archived" },
    });
    res.json({ message: "Event archived successfully", event: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error or event not found" });
  }
});

export default router;
