import { Router } from "express";
import { PrismaClient, RSVPStatus } from "@prisma/client";
import { z } from "zod";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { EventVisibility, EventStatus } from "../types/enums";
import {
  rsvpEvent,
  cancelRsvp,
  listAttendees,
  publishEvent,
  archiveEvent,
  generateICalFeed,
} from "../services/events.service";

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
    const eventData = { ...parsed.data, created_by: req.user!.id } as any;
    if (eventData.start_time) eventData.start_time = new Date(eventData.start_time);
    if (eventData.end_time) eventData.end_time = new Date(eventData.end_time);

    const event = await prisma.events.create({ data: eventData });
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
  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

  try {
    const dataToUpdate = { ...parsed.data } as any;
    if (dataToUpdate.start_time) dataToUpdate.start_time = new Date(dataToUpdate.start_time);
    if (dataToUpdate.end_time) dataToUpdate.end_time = new Date(dataToUpdate.end_time);

    const updated = await prisma.events.update({
      where: { id },
      data: dataToUpdate,
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
      data: { status: EventStatus.Archived },
    });
    res.json({ message: "Događaj arhiviran", event: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error or event not found" });
  }
});

// --- POST /api/events/:id/rsvp ---
router.post("/:id/rsvp", authenticate, async (req, res) => {
  const userId = req.user!.id;
  const eventId = Number(req.params.id);

  try {
    const registration = await rsvpEvent(userId, eventId);
    res.json(registration);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// --- DELETE /api/events/:id/rsvp ---
router.delete("/:id/rsvp", authenticate, async (req, res) => {
  const userId = req.user!.id;
  const eventId = Number(req.params.id);

  try {
    await cancelRsvp(userId, eventId);
    res.json({ message: "RSVP canceled" });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// --- GET /api/events/:id/attendees (admin only) ---
router.get("/:id/attendees", authenticate, requireAdmin, async (req, res) => {
  const eventId = Number(req.params.id);
  const status = req.query.status as RSVPStatus | undefined;

  try {
    const attendees = await listAttendees(eventId, status);
    res.json(attendees);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- POST /api/events/:id/publish (admin only) ---
router.post("/:id/publish", authenticate, requireAdmin, async (req, res) => {
  const eventId = Number(req.params.id);
  try {
    const updated = await publishEvent(eventId);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// --- POST /api/events/:id/archive (admin only) ---
router.post("/:id/archive", authenticate, requireAdmin, async (req, res) => {
  const eventId = Number(req.params.id);
  try {
    const updated = await archiveEvent(eventId);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// --- GET /api/events/calendar ---
router.get("/calendar", async (req, res) => {
  try {
    const icsData = await generateICalFeed();
    res.setHeader("Content-Type", "text/calendar");
    res.send(icsData);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;