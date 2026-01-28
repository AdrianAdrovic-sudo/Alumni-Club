import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding thesis data...");

    // 1. Update existing users (excluding admin if possible, or just update all suitable)
    const users = await prisma.users.findMany({
        where: {
            role: "user", // specific to alumni/regular users
        },
        take: 5,
    });

    const thesisSamples = [
        {
            title: "Informacioni sistem Rent-a cara",
            type: "Bachelor",
            mentor_first: "Marko",
            mentor_last: "Marković",
        },
        {
            title: "Prikupljanje činjenica za IS studentske službe",
            type: "Master",
            mentor_first: "Jovan",
            mentor_last: "Jovanović",
        },
        {
            title: "Sigurnost web aplikacija",
            type: "Specialist",
            mentor_first: "Ana",
            mentor_last: "Anić",
        },
        {
            title: "Razvoj mobilnih aplikacija",
            type: "Bachelor",
            mentor_first: "Petar",
            mentor_last: "Petrović",
        },
        {
            title: "Optimizacija bazi podataka",
            type: "Master",
            mentor_first: "Ivana",
            mentor_last: "Ivanović",
        },
    ];

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const sample = thesisSamples[i % thesisSamples.length];

        await prisma.users.update({
            where: { id: user.id },
            data: {
                thesis_title: sample.title,
                thesis_type: sample.type,
                mentor_first_name: sample.mentor_first,
                mentor_last_name: sample.mentor_last,
                defense_date: new Date(2023, i, 15), // Randomize slightly
                thesis_document_url: `/theses/sample-${i}.pdf`,
            },
        });
        console.log(`Updated user ${user.email} with thesis: ${sample.title}`);
    }

    // 2. If fewer than 5 users existed, create new ones to ensure we have data
    if (users.length < 5) {
        console.log("Not enough existing users, creating new ones...");
        const needed = 5 - users.length;
        for (let i = 0; i < needed; i++) {
            const sample = thesisSamples[i % thesisSamples.length];
            const uniqueSuffix = Date.now() + i;

            await prisma.users.create({
                data: {
                    first_name: `Alumni${i}`,
                    last_name: `User${i}`,
                    email: `alumni${uniqueSuffix}@example.com`,
                    password_hash: "hashedpassword123", // Dummy hash
                    username: `alumni${uniqueSuffix}`,
                    enrollment_year: 2018,
                    role: "user",
                    thesis_title: sample.title,
                    thesis_type: sample.type,
                    mentor_first_name: sample.mentor_first,
                    mentor_last_name: sample.mentor_last,
                    defense_date: new Date(2023, i + 5, 20),
                    thesis_document_url: `/theses/new-${i}.pdf`,
                }
            })
            console.log(`Created new alumni user with thesis: ${sample.title}`);
        }
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
