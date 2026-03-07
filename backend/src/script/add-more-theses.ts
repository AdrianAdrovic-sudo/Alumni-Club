import prisma from "../prisma";

async function addMoreTheses() {
  console.log("🌱 Dodavanje dodatnih diplomskih radova...");

  try {
    // Prvo proveri da li postoje korisnici
    const users = await prisma.users.findMany({ take: 5 });
    
    if (users.length === 0) {
      console.log("❌ Nema korisnika u bazi. Prvo dodaj korisnike.");
      return;
    }

    console.log(`✅ Pronađeno ${users.length} korisnika`);

    // Dodaj još diplomskih radova za različite godine
    const newThesesData = [
      // 2012
      {
        first_name: "Stefan",
        last_name: "Petrović",
        title: "Razvoj mobilne aplikacije za e-trgovinu",
        type: "bachelors",
        file_url: "/theses/petrovic-stefan.pdf",
        year: 2012,
        user_id: users[0].id
      },
      {
        first_name: "Milica",
        last_name: "Jovanović",
        title: "Analiza korisničkog iskustva web aplikacija",
        type: "masters",
        file_url: "/theses/jovanovic-milica.pdf",
        year: 2012,
        user_id: users[0].id
      },
      {
        first_name: "Nikola",
        last_name: "Đorđević",
        title: "Implementacija REST API servisa",
        type: "bachelors",
        file_url: "/theses/djordjevic-nikola.pdf",
        year: 2012,
        user_id: users[0].id
      },
      // 2016
      {
        first_name: "Aleksandra",
        last_name: "Nikolić",
        title: "Machine Learning u prepoznavanju obrazaca",
        type: "masters",
        file_url: "/theses/nikolic-aleksandra.pdf",
        year: 2016,
        user_id: users[0].id
      },
      {
        first_name: "Luka",
        last_name: "Marković",
        title: "Cloud computing arhitektura",
        type: "specialist",
        file_url: "/theses/markovic-luka.pdf",
        year: 2016,
        user_id: users[0].id
      },
      {
        first_name: "Sara",
        last_name: "Popović",
        title: "Blockchain tehnologija u finansijama",
        type: "bachelors",
        file_url: "/theses/popovic-sara.pdf",
        year: 2016,
        user_id: users[0].id
      },
      // 2019
      {
        first_name: "Miloš",
        last_name: "Stanković",
        title: "Razvoj Progressive Web aplikacija",
        type: "bachelors",
        file_url: "/theses/stankovic-milos.pdf",
        year: 2019,
        user_id: users[0].id
      },
      {
        first_name: "Jovana",
        last_name: "Ilić",
        title: "Optimizacija baza podataka",
        type: "masters",
        file_url: "/theses/ilic-jovana.pdf",
        year: 2019,
        user_id: users[0].id
      },
      {
        first_name: "Nemanja",
        last_name: "Kostić",
        title: "Cyber security u IoT sistemima",
        type: "specialist",
        file_url: "/theses/kostic-nemanja.pdf",
        year: 2019,
        user_id: users[0].id
      },
      // 2021
      {
        first_name: "Teodora",
        last_name: "Simić",
        title: "AI u medicinskoj dijagnostici",
        type: "masters",
        file_url: "/theses/simic-teodora.pdf",
        year: 2021,
        user_id: users[0].id
      },
      {
        first_name: "Filip",
        last_name: "Pavlović",
        title: "Mikroservisna arhitektura",
        type: "bachelors",
        file_url: "/theses/pavlovic-filip.pdf",
        year: 2021,
        user_id: users[0].id
      },
      {
        first_name: "Katarina",
        last_name: "Đukić",
        title: "DevOps praksa u modernom razvoju",
        type: "specialist",
        file_url: "/theses/djukic-katarina.pdf",
        year: 2021,
        user_id: users[0].id
      },
      // 2023 - dodatni radovi
      {
        first_name: "Vuk",
        last_name: "Milošević",
        title: "React Native razvoj mobilnih aplikacija",
        type: "bachelors",
        file_url: "/theses/milosevic-vuk.pdf",
        year: 2023,
        user_id: users[0].id
      },
      {
        first_name: "Anđela",
        last_name: "Todorović",
        title: "GraphQL vs REST API",
        type: "masters",
        file_url: "/theses/todorovic-andjela.pdf",
        year: 2023,
        user_id: users[0].id
      },
      // 2024 - dodatni radovi
      {
        first_name: "Dušan",
        last_name: "Vasić",
        title: "Kubernetes orkestacija kontejnera",
        type: "masters",
        file_url: "/theses/vasic-dusan.pdf",
        year: 2024,
        user_id: users[0].id
      },
      {
        first_name: "Milena",
        last_name: "Ristić",
        title: "Next.js framework za web razvoj",
        type: "bachelors",
        file_url: "/theses/ristic-milena.pdf",
        year: 2024,
        user_id: users[0].id
      }
    ];

    const result = await prisma.theses.createMany({
      data: newThesesData,
      skipDuplicates: true
    });

    console.log(`✅ Dodato ${result.count} novih diplomskih radova`);

    // Proveri koliko ukupno ima radova
    const totalTheses = await prisma.theses.count();
    console.log(`📊 Ukupno radova u bazi: ${totalTheses}`);

    // Prikaži statistiku po godinama
    const theses = await prisma.theses.findMany();
    const yearStats: any = {};
    
    theses.forEach(t => {
      if (!yearStats[t.year || 0]) {
        yearStats[t.year || 0] = 0;
      }
      yearStats[t.year || 0]++;
    });

    console.log("\n📈 Statistika po godinama:");
    Object.keys(yearStats).sort().forEach(year => {
      console.log(`   ${year}: ${yearStats[year]} radova`);
    });

  } catch (error) {
    console.error("❌ Greška:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreTheses();
