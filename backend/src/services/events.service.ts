import { PrismaClient, RSVPStatus, EventStatus, EventVisibility  } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";
import { createEvents } from "ics";

const prisma = new PrismaClient();

/**
 * RSVP (ulogovani korisnik)
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

  const rsvpStatus =
    event.capacity && goingCount >= event.capacity
      ? RSVPStatus.Waitlist
      : RSVPStatus.Going;

  const registration = await prisma.event_registration.upsert({
    where: {
      user_id_event_id: {
        user_id: userId,
        event_id: eventId,
      },
    },
    update: { rsvp: rsvpStatus },
    create: {
      user_id: userId,
      event_id: eventId,
      rsvp: rsvpStatus,
    },
  });

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
 * Cancel RSVP (ulogovani korisnik)
 */
export async function cancelRsvp(userId: number, eventId: number) {
  const event = await prisma.events.findUnique({
    where: { id: eventId },
    include: { event_registration: { orderBy: { registered_at: "asc" } } },
  });
  if (!event) throw new Error("Event not found");

  await prisma.event_registration.deleteMany({
    where: { user_id: userId, event_id: eventId },
  });

  const goingCount = event.event_registration.filter(
    (e) => e.rsvp === RSVPStatus.Going && e.user_id !== userId
  ).length;

  if (event.capacity && goingCount < event.capacity) {
    const nextOnWaitlist = await prisma.event_registration.findFirst({
      where: {
        event_id: eventId,
        rsvp: RSVPStatus.Waitlist,
      },
      orderBy: { registered_at: "asc" },
    });

    if (nextOnWaitlist) {
      await prisma.event_registration.update({
        where: { id: nextOnWaitlist.id },
        data: { rsvp: RSVPStatus.Going },
      });

      if (nextOnWaitlist.user_id) {
        const promotedUser = await prisma.users.findUnique({
          where: { id: nextOnWaitlist.user_id },
        });

        if (promotedUser) {
          await prisma.outbox_emails.create({
            data: {
              to: promotedUser.email,
              user_id: promotedUser.id,
              event_id: eventId,
              subject: `RSVP Update: spot available`,
              body: `A spot opened up for "${event.title}". Your status is now Going.`,
            },
          });
        }
      }
    }
  }

  return true;
}

/**
 * Guest RSVP (samo PUBLIC događaji)
 */
export async function rsvpGuestEvent(
  eventId: number,
  guest: {
    firstName: string;
    lastName: string;
    email: string;
  }
) {
  const event = await prisma.events.findUnique({
    where: { id: eventId },
    include: { event_registration: true },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // Guest RSVP dozvoljen samo za PUBLIC evente
  if (event.visibility !== "Public") {
    throw new Error("Guest RSVP not allowed for this event");
  }

  // Guest NE IDE na waitlist → ako je puno, zabrani
  if (event.capacity !== null) {
    const goingCount = event.event_registration.filter(
      (r) => r.rsvp === "Going"
    ).length;

    if (goingCount >= event.capacity) {
      throw new Error(
        "Događaj je popunjen. Prijava za goste nije moguća."
      );
    }
  }

  // Upis guest RSVP-a
  const registration = await prisma.event_registration.create({
    data: {
      event_id: eventId,
      user_id: null, // gost nema user nalog
      rsvp: "Going",
      guest_first_name: guest.firstName,
      guest_last_name: guest.lastName,
      guest_email: guest.email,
    },
  });

  return registration;
}


/**
 * Lista učesnika (admin)
 */
export async function listAttendees(eventId: number, status?: RSVPStatus) {
  return prisma.event_registration.findMany({
    where: {
      event_id: eventId,
      ...(status ? { rsvp: status } : {}),
    },
    include: {
      users: true,
    },
    orderBy: {
      registered_at: "asc",
    },
  });
}

/**
 * Publish event
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
 * Generate iCal feed
 */
export async function generateICalFeed(eventId?: number) {
  const events = await prisma.events.findMany({
    where: {
      status: EventStatus.Published,
      deleted: false,
      ...(eventId ? { id: eventId } : {}),
    },
  });

  if (!events.length) return null;

  const icsEvents = events.map((ev) => ({
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

  const { error, value } = createEvents(icsEvents as any);
  if (error) throw error;

  if (!eventId) {
    writeFileSync(
      join(__dirname, "../../public/events.ics"),
      value || ""
    );
  }

  return value;
}

/**
 * Event stats
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
