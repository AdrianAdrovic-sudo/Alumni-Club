import prisma from "../prisma";

async function add2013Theses() {
  console.log("🌱 Dodavanje radova za 2013. godinu...");

  try {
    const users = await prisma.users.findMany({ take: 5 });
    
    if (users.length === 0) {
      console.log("❌ Nema korisnika u bazi.");
      return;
    }

    // Dodaj 5 radova za 2013. godinu
    const theses2013 = [
      {
        first_name: "Petar",
        last_name: "Jovanović",
        title: "Razvoj Android aplikacija",
        type: "bachelors",
        file_url: "/theses/jovanovic-petar.pdf",
        year: 2013,
        user_id: users[0].id
      },
      {
        first_name: "Marija",
        last_name: "Nikolić",
        title: "iOS razvoj sa Swift-om",
        type: "masters",
        file_url: "/theses/nikolic-marija.pdf",
        year: 2013,
        user_id: users[0].id
      },
      {
        first_name: "Aleksandar",
        last_name: "Petrović",
        title: "Responsive web dizajn",
        type: "bachelors",
        file_url: "/theses/petrovic-aleksandar.pdf",
        year: 2013,
        user_id: users[0].id
      },
      {
        first_name: "Jelena",
        last_name: "Đorđević",
        title: "SEO optimizacija web stranica",
        type: "specialist",
        file_url: "/theses/djordjevic-jelena.pdf",
        year: 2013,
        user_id: users[0].id
      },
      {
        first_name: "Milan",
        last_name: "Stojanović",
        title: "Agile metodologija u razvoju softvera",
        type: "masters",
        file_url: "/theses/stojanovic-milan.pdf",
        year: 2013,
        user_id: users[0].id
      }
    ];

    const result = await prisma.theses.createMany({
      data: theses2013,
      skipDuplicates: true
    });

    console.log(`✅ Dodato ${result.count} radova za 2013. godinu`);

    // Proveri statistiku
    const totalTheses = await prisma.theses.count();
    console.log(`📊 Ukupno radova u bazi: ${totalTheses}`);

    const theses2013Count = await prisma.theses.count({
      where: { year: 2013 }
    });
    console.log(`📈 Radova u 2013: ${theses2013Count}`);

  } catch (error) {
    console.error("❌ Greška:", error);
  } finally {
    await prisma.$disconnect();
  }
}

add2013Theses();
