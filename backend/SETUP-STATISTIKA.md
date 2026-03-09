# Postavljanje proširene statistike diplomskih radova

## Šta je dodato?

Proširena je statistika diplomskih radova sa sledećim podacima:

- **Statistika mentora** - Prikaz broja radova po mentoru
- **Statistika članova komisija** - Prikaz broja učešća u komisijama
- **Statistika ocjena** - Distribucija ocjena (A, B, C, D, E, F)
- **Prosječna ocjena** - Prosječna ocjena svih radova
- **Statistika tema** - Najčešće teme diplomskih radova
- **Statistika ključnih riječi** - Najčešće korišćene ključne riječi

## Koraci za postavljanje

### 1. Zaustavi backend server

Ako je backend server pokrenut, zaustavi ga sa `Ctrl+C` u terminalu.

### 2. Pokreni setup skriptu

```bash
cd backend
setup-extended-stats.bat
```

Skripta će:
- Regenerisati Prisma klijent sa novim poljima
- Dodati 30 test radova sa svim podacima
- Prikazati status

### 3. Pokreni backend server

```bash
npm run dev
```

### 4. Otvori frontend

Frontend će automatski učitati nove podatke i prikazati proširenu statistiku.

## Struktura podataka

### Novi podaci u bazi (theses tabela):

- `mentor` - Ime mentora (VARCHAR 255)
- `committee_members` - Članovi komisije, odvojeni zarezom (TEXT)
- `grade` - Ocjena: A, B, C, D, E, F (VARCHAR 10)
- `topic` - Tema rada (VARCHAR 255)
- `keywords` - Ključne riječi, odvojene zarezom (TEXT)

### CSV format za upload:

```csv
first_name,last_name,title,type,year,file_url,mentor,committee_members,grade,topic,keywords
Marko,Marković,Naslov rada,bachelors,2024,https://example.com/rad.pdf,Prof. dr Ivan Petrović,"Prof. dr Ivan Petrović, Doc. dr Ana Jovanović",A,Machine Learning,"AI, Machine Learning, Neural Networks"
```

## Test podaci

Seed skripta dodaje 30 radova sa:
- 5 različitih mentora
- 4 različite kombinacije članova komisija
- Ocjene: A (20%), B (35%), C (25%), D (10%)
- 10 različitih tema
- 10 različitih setova ključnih riječi
- Godine: 2020-2024

## Napomene

- Svi novi podaci su opcioni (nullable)
- Postojeći radovi bez novih podataka će i dalje raditi
- Statistika se automatski prilagođava dostupnim podacima
- Ako nema podataka za neku statistiku, ta sekcija se neće prikazati
