import prisma from "../prisma";

async function seedTheses() {
  console.log("🌱 Dodavanje test podataka za diplomske radove...");

  try {
    // Prvo proveri da li postoje korisnici
    const users = await prisma.users.findMany({ take: 5 });
    
    if (users.length === 0) {
      console.log("❌ Nema korisnika u bazi. Prvo dodaj korisnike.");
      return;
    }

    console.log(`✅ Pronađeno ${users.length} korisnika`);

    // Dodaj test diplomske radove
    const thesesData = [
      {
        first_name: "Miloš",
        last_name: "Žižić",
        title: "Informacioni sistem Rent-a cara",
        type: "bachelors",
        file_url: "/theses/zizic-milos.pdf",
        year: 2009,
        user_id: users[0].id
      },
      {
        first_name: "Tripo",
        last_name: "Matijević",
        title: "Prikupljanje činjenica za informacioni sistem studentske službe",
        type: "masters",
        file_url: "/theses/matijevic-tripo.pdf",
        year: 2010,
        user_id: users[0].id
      },
      {
        first_name: "Zoran",
        last_name: "Ćorović",
        title: "Model, objekti i veze informacionog sistema studentske službe",
        type: "bachelors",
        file_url: "/theses/corovic-zoran.pdf",
        year: 2010,
        user_id: users[0].id
      },
      {
        first_name: "Dženan",
        last_name: "Strujić",
        title: "Relacioni model informacionog sistema studentske službe",
        type: "specialist",
        file_url: "/theses/strujic-dzenan.pdf",
        year: 2015,
        user_id: users[0].id
      },
      {
        first_name: "Novak",
        last_name: "Radulović",
        title: "Forme i izvještaj informacionog sistema studentske službe",
        type: "masters",
        file_url: "/theses/radulovic-novak.pdf",
        year: 2015,
        user_id: users[0].id
      },
      {
        first_name: "Igor",
        last_name: "Pekić",
        title: "Sigurnost informacionog sistema studentske službe",
        type: "bachelors",
        file_url: "/theses/pekic-igor.pdf",
        year: 2018,
        user_id: users[0].id
      },
      {
        first_name: "Ana",
        last_name: "Jovanović",
        title: "Web aplikacija za studentsku službu",
        type: "specialist",
        file_url: "/theses/jovanovic-ana.pdf",
        year: 2020,
        user_id: users[0].id
      },
      {
        first_name: "Jelena",
        last_name: "Marković",
        title: "Implementacija informacionog sistema studentske službe",
        type: "masters",
        file_url: "/theses/markovic-jelena.pdf",
        year: 2022,
        user_id: users[0].id
      },
      {
        first_name: "Marko",
        last_name: "Nikolić",
        title: "Testiranje informacionog sistema studentske službe",
        type: "bachelors",
        file_url: "/theses/nikolic-marko.pdf",
        year: 2023,
        user_id: users[0].id
      },
      {
        first_name: "Ivana",
        last_name: "Stojanović",
        title: "Održavanje informacionog sistema studentske službe",
        type: "specialist",
        file_url: "/theses/stojanovic-ivana.pdf",
        year: 2024,
        user_id: users[0].id
      }
    ];

    const result = await prisma.theses.createMany({
      data: thesesData,
      skipDuplicates: true
    });

    console.log(`✅ Dodato ${result.count} diplomskih radova`);

    // Proveri koliko ukupno ima radova
    const totalTheses = await prisma.theses.count();
    console.log(`📊 Ukupno radova u bazi: ${totalTheses}`);

  } catch (error) {
    console.error("❌ Greška:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTheses();
