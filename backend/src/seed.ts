import { PrismaClient, EventVisibility, EventStatus, RSVPStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Passwordi
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const alumniPasswordHash = await bcrypt.hash("alumni123", 10);

  // PROVJERA I KREIRANJE ADMINA
  let admin = await prisma.users.findFirst({
    where: { username: "admin" },
  });

  if (!admin) {
    admin = await prisma.users.create({
      data: {
        first_name: "Admin",
        last_name: "User",
        username: "admin",
        email: "admin@example.com",
        password_hash: adminPasswordHash,
        role: "admin",
        enrollment_year: 2020,
      },
    });
    console.log("Kreiran admin:", admin.username);
  } else {
    console.log("Admin već postoji:", admin.username);
  }

  // PROVJERA I KREIRANJE ALUMNI USERA
  let alumni = await prisma.users.findFirst({
    where: { username: "alumni" },
  });

  if (!alumni) {
    alumni = await prisma.users.create({
      data: {
        first_name: "Alumni",
        last_name: "User",
        username: "alumni",
        email: "alumni@example.com",
        password_hash: alumniPasswordHash,
        role: "user",
        enrollment_year: 2021,
      },
    });
    console.log("Kreiran alumni:", alumni.username);
  } else {
    console.log("Alumni već postoji:", alumni.username);
  }

  // VENUES
  const venuesData = [
    { name: "Main Hall", address: "Campus A", capacity: 300 },
    { name: "Auditorium", address: "Campus B", capacity: 150 },
    { name: "Conference Room", address: "Campus C", capacity: 50 },
  ];

  for (const v of venuesData) {
    const existing = await prisma.venues.findFirst({
      where: { name: v.name },
    });
    if (!existing) {
      await prisma.venues.create({ data: v });
      console.log("Kreiran venue:", v.name);
    } else {
      console.log("Venue već postoji:", v.name);
    }
  }

  // EVENTI
  const eventsData = [
    {
      title: "Welcome Event",
      slug: "welcome-event",
      description: "Opening ceremony event.",
      start_time: new Date("2025-12-30T13:00"),
      end_time: new Date("2025-12-30T17:00"),
      timezone: "UTC",
      location: "Campus A",
      venue_name: "Main Hall",
      capacity: 100,
      visibility: EventVisibility.Public,
      status: EventStatus.Published,
    },
    {
      title: "Networking Meetup",
      slug: "networking-meetup",
      description: "Meet alumni and expand your network.",
      start_time: new Date("2025-12-15T18:00"),
      end_time: new Date("2025-12-15T20:00"),
      timezone: "UTC",
      location: "Campus B",
      venue_name: "Auditorium",
      capacity: 150,
      visibility: EventVisibility.Public,
      status: EventStatus.Published,
    },
    {
      title: "Workshop on AI",
      slug: "ai-workshop",
      description: "Hands-on AI workshop for students.",
      start_time: new Date("2025-11-20T09:00"),
      end_time: new Date("2025-11-20T12:00"),
      timezone: "UTC",
      location: "Campus C",
      venue_name: "Conference Room",
      capacity: 50,
      visibility: EventVisibility.Members,
      status: EventStatus.Published,
    },
  ];

  for (const ev of eventsData) {
    const existing = await prisma.events.findFirst({
      where: { slug: ev.slug },
    });

    const venue = await prisma.venues.findFirst({
      where: { name: ev.venue_name },
    });

    if (!existing) {
      await prisma.events.create({
        data: {
          title: ev.title,
          slug: ev.slug,
          description: ev.description,
          start_time: ev.start_time,
          end_time: ev.end_time,
          timezone: ev.timezone,
          location: ev.location,
          venue_id: venue ? venue.id : null,
          capacity: ev.capacity,
          visibility: ev.visibility,
          status: ev.status,
          created_by: admin.id,
        },
      });
      console.log("Kreiran event:", ev.title);
    } else {
      console.log("Event već postoji:", ev.title);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
