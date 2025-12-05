import { PrismaClient, EventVisibility, EventStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing DB...");

  // Order matters (delete children first)
  await prisma.events.deleteMany({});
  await prisma.venues.deleteMany({});
  await prisma.users.deleteMany({});

  console.log("Seeding admin user...");

  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.users.create({
    data: {
      first_name: "Admin",
      last_name: "User",
      username: "admin",
      email: "admin@podgorica.edu",
      password_hash: adminPasswordHash,
      role: "admin",
      enrollment_year: 2020
    }
  });

  console.log("Admin created:", admin.username);

  console.log("Seeding venues...");

  const venue = await prisma.venues.create({
    data: {
      name: "Main Hall",
      capacity: 200
    }
  });

  console.log("Venue created:", venue.name);

  console.log("Seeding events...");

  await prisma.events.create({
    data: {
      title: "Welcome Event",
      slug: "welcome-event",
      description: "Opening ceremony event.",
      start_time: new Date("2025-06-10T10:00:00Z"),
      end_time: new Date("2025-06-10T12:00:00Z"),
      timezone: "UTC",
      location: "Campus A",
      venue_id: venue.id,
      capacity: 100,
      visibility: EventVisibility.Public,      // MUST be enum
      status: EventStatus.Published,           // MUST be enum
      created_by: admin.id
    }
  });

  console.log("Events seeded.");
}

main()
  .then(() => {
    console.log("Seeding completed.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Seeding error:", e);
    prisma.$disconnect();
    process.exit(1);
  });
