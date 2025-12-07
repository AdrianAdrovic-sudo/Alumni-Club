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

  console.log(`[RSVP] User ${userId} RSVP'd as ${rsvpStatus} for event ${eventId}`);

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

export async function cancelRsvp(userId: number, eventId: number) {
  console.log("Cancel RSVP called", { userId, eventId });

  // Prvo pronađi event sa registracijama
  const event = await prisma.events.findUnique({
    where: { id: eventId },
    include: { event_registration: { orderBy: { registered_at: "asc" } } },
  });
  if (!event) throw new Error("Event not found");

  // Obriši korisnikov RSVP
  const deleted = await prisma.event_registration.deleteMany({
    where: { user_id: userId, event_id: eventId },
  });
  console.log("Deleted RSVP rows:", deleted.count);

  // Broj trenutno Going
  const goingCount = event.event_registration.filter(
    (e) => e.rsvp === RSVPStatus.Going && e.user_id !== userId
  ).length;

  console.log("Going count after cancellation:", goingCount);

  // Ako ima preostalo mjesta, promijeni prvog sa Waitlist u Going
  if (event.capacity && goingCount < event.capacity) {
    const nextOnWaitlist = await prisma.event_registration.findFirst({
      where: { event_id: eventId, rsvp: RSVPStatus.Waitlist },
      orderBy: { registered_at: "asc" },
    });

    if (nextOnWaitlist) {
      console.log("Promoting from waitlist:", nextOnWaitlist.user_id);

      await prisma.event_registration.update({
        where: { id: nextOnWaitlist.id },
        data: { rsvp: RSVPStatus.Going },
      });

      // Pošalji email toj osobi
      const userOnWaitlist = await prisma.users.findUnique({
        where: { id: nextOnWaitlist.user_id },
      });

      if (userOnWaitlist) {
        await prisma.outbox_emails.create({
          data: {
            to: userOnWaitlist.email,
            user_id: userOnWaitlist.id,
            event_id: eventId,
            subject: `RSVP Update: place available for ${event.title}`,
            body: `A spot opened up for "${event.title}". Your status has been updated to Going.`,
          },
        });
      }
    }
  }

  // Email za korisnika koji je otkazao
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (user) {
    await prisma.outbox_emails.create({
      data: {
        to: user.email,
        user_id: userId,
        event_id: eventId,
        subject: `RSVP Cancelled`,
        body: `Your RSVP for event "${event.title}" has been cancelled.`,
      },
    });
  }

  console.log("Cancellation complete");

  return deleted;
}



/**
 * Lista učesnika - admin only
 */
export async function listAttendees(eventId: number, status?: RSVPStatus) {
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

  const filePath = join(__dirname, "../../public/events.ics");
  writeFileSync(filePath, value || "");

  return value;
}

/**
 * Dobija event sa statistikama: broj Going, Waitlist, preostala mjesta
 */
export async function getEventWithStats(eventId: number) {
  const event = await prisma.events.findUnique({
    where: { id: eventId },
    include: { event_registration: true },
  });

  if (!event) throw new Error("Event not found");

  const goingCount = event.event_registration.filter(
    (e) => e.rsvp === RSVPStatus.Going
  ).length;

  const waitlistCount = event.event_registration.filter(
    (e) => e.rsvp === RSVPStatus.Waitlist
  ).length;

  const remainingSeats = event.capacity
    ? Math.max(0, event.capacity - goingCount)
    : 0;

  return {
    ...event,
    goingCount,
    waitlistCount,
    remainingSeats,
  };
}
