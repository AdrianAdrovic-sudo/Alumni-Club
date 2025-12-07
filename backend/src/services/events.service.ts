import { PrismaClient, RSVPStatus, EventStatus } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";
import ics, { EventAttributes } from "ics";

const prisma = new PrismaClient();

/**
 * RSVP na događaj
 */
export async function rsvpEvent(userId: number, eventId: number) {
  const event = await prisma.events.findUnique({
    where: { id: eventId },
    include: { event_registration: true },
  });
  if (!event) throw new Error("Event not found");

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // Provera kapaciteta
  const goingCount = event.event_registration.filter(
    (e) => e.rsvp === RSVPStatus.Going
  ).length;

  let rsvpStatus: RSVPStatus;
  if (event.capacity && goingCount >= event.capacity) {
    rsvpStatus = RSVPStatus.Waitlist;
  } else {
    rsvpStatus = RSVPStatus.Going;
  }

  const registration = await prisma.event_registration.upsert({
    where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    update: { rsvp: rsvpStatus },
    create: { user_id: userId, event_id: eventId, rsvp: rsvpStatus },
  });

  // --- Minimalno dodat: logovanje draft email ---
  await prisma.outbox_emails.create({
    data: {
      to: user.email,
      user_id: userId,
      event_id: eventId,
      subject: `RSVP Confirmation: ${event.title}`,
      body: `You have successfully RSVP'd as ${rsvpStatus} for "${event.title}"`,
    },
  });

  return registration;
}

/**
 * Cancel RSVP
 */
export async function cancelRsvp(userId: number, eventId: number) {
  const deleted = await prisma.event_registration.deleteMany({
    where: { user_id: userId, event_id: eventId },
  });

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // --- Minimalno dodat: logovanje draft email ---
  await prisma.outbox_emails.create({
    data: {
      to: user.email,
      user_id: userId,
      event_id: eventId,
      subject: `RSVP Cancelled`,
      body: `Your RSVP for event ID ${eventId} has been cancelled.`,
    },
  });

  return deleted;
}

/**
 * Lista učesnika - admin only
 */
export async function listAttendees(
  eventId: number,
  status?: RSVPStatus
) {
  return prisma.event_registration.findMany({
    where: { event_id: eventId, ...(status ? { rsvp: status } : {}) },
    include: { users: true },
  });
}

/**
 * Publish event - transition Draft -> Published
 */
export async function publishEvent(eventId: number) {
  return prisma.events.update({
    where: { id: eventId },
    data: { status: EventStatus.Published },
  });
}

/**
 * Archive event
 */
export async function archiveEvent(eventId: number) {
  return prisma.events.update({
    where: { id: eventId },
    data: { status: EventStatus.Archived },
  });
}

/**
 * Generate iCal feed za sve Published events
 */
export async function generateICalFeed() {
  const events = await prisma.events.findMany({
    where: { status: EventStatus.Published, deleted: false },
  });

  const icsEvents: EventAttributes[] = events.map((ev) => ({
    start: [
      ev.start_time.getFullYear(),
      ev.start_time.getMonth() + 1,
      ev.start_time.getDate(),
      ev.start_time.getHours(),
      ev.start_time.getMinutes(),
    ],
    end: [
      ev.end_time.getFullYear(),
      ev.end_time.getMonth() + 1,
      ev.end_time.getDate(),
      ev.end_time.getHours(),
      ev.end_time.getMinutes(),
    ],
    title: ev.title || "",
    description: ev.description || "",
    location: ev.location || "",
    url: `http://localhost:3000/events/${ev.id}`,
  }));

  const { error, value } = ics.createEvents(icsEvents);
  if (error) throw error;

  // Čuvanje u fajl (opciono)
  const filePath = join(__dirname, "../../public/events.ics");
  writeFileSync(filePath, value || "");

  return value;
}