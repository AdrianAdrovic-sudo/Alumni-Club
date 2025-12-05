import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const admin = await prisma.users.upsert({
  where: { email: "admin@podgorica.edu" },
  update: {},
  create: {
    first_name: "Admin",
    last_name: "User",
    email: "admin@podgorica.edu",
    username: "admin",
    password_hash: "hashedpassword", // ovdje možeš staviti dummy hash
    role: "Admin",
    enrollment_year: 2020
  },
});
  // --- Seed Venues ---
  await prisma.venues.createMany({
    data: [
      { name: "Hotel Hilton Podgorica", address: "Bulevar Svetog Petra Cetinjskog 2", capacity: 250 },
      { name: "Podgorica City Hall", address: "Trg Republike 1", capacity: 150 },
      { name: "Millennium Bridge Outdoor Area", address: "Bulevar Džordža Vašingtona", capacity: 500 },
    ],
    skipDuplicates: true,
  });
  console.log("Venues seeded");

  // --- Seed Events ---
  await prisma.events.createMany({
    data: [
      {
        title: "Alumni Networking Night",
        slug: "alumni-networking-night",
        description: "Networking event for alumni of local universities.",
        start_time: new Date("2025-12-10T18:00:00Z"),
        end_time: new Date("2025-12-10T21:00:00Z"),
        timezone: "Europe/Podgorica",
        location: "Hotel Hilton Podgorica, Bulevar Svetog Petra Cetinjskog 2",
        venue_id: 1,
        capacity: 250,
        visibility: "Public",
        status: "Published",
        created_by: admin.id,
      },
      {
        title: "Tech Talk: AI in 2025",
        slug: "tech-talk-ai-2025",
        description: "Panel discussion on AI and future technologies.",
        start_time: new Date("2025-12-12T17:00:00Z"),
        end_time: new Date("2025-12-12T19:00:00Z"),
        timezone: "Europe/Podgorica",
        location: "Podgorica City Hall, Trg Republike 1",
        venue_id: 2,
        capacity: 150,
        visibility: "Members",
        status: "Published",
        created_by: admin.id,
      },
      {
        title: "Holiday Celebration",
        slug: "holiday-celebration",
        description: "End-of-year celebration for alumni and guests.",
        start_time: new Date("2025-12-20T19:00:00Z"),
        end_time: new Date("2025-12-20T23:00:00Z"),
        timezone: "Europe/Podgorica",
        location: "Millennium Bridge Outdoor Area, Bulevar Džordža Vašingtona",
        venue_id: 3,
        capacity: 500,
        visibility: "Public",
        status: "Draft",
        created_by: admin.id,
      },
      {
        title: "Career Workshop",
        slug: "career-workshop",
        description: "Resume building and interview preparation for students and alumni.",
        start_time: new Date("2026-01-05T15:00:00Z"),
        end_time: new Date("2026-01-05T18:00:00Z"),
        timezone: "Europe/Podgorica",
        location: "Hotel Hilton Podgorica, Bulevar Svetog Petra Cetinjskog 2",
        venue_id: 1,
        capacity: 100,
        visibility: "Members",
        status: "Draft",
        created_by: admin.id,
      },
      {
        title: "Spring Alumni Meetup",
        slug: "spring-alumni-meetup",
        description: "Networking event to welcome the spring season.",
        start_time: new Date("2026-03-10T16:00:00Z"),
        end_time: new Date("2026-03-10T19:00:00Z"),
        timezone: "Europe/Podgorica",
        location: "Podgorica City Hall, Trg Republike 1",
        venue_id: 2,
        capacity: 150,
        visibility: "Public",
        status: "Published",
        created_by: admin.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Events seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
