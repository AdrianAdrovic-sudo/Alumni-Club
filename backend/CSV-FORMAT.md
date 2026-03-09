# CSV Format za upload diplomskih radova

## Obavezne kolone:
- `first_name` - Ime studenta
- `last_name` - Prezime studenta
- `title` - Naziv diplomskog rada
- `type` - Tip rada: `bachelors`, `masters`, ili `specialist`
- `year` - Godina diplomiranja (broj)
- `file_url` - URL do PDF fajla

## Opcione kolone (za statistiku):
- `mentor` - Ime mentora (npr. "Prof. dr Ivan Petrović")
- `committee_members` - Članovi komisije, odvojeni zarezom (npr. "Prof. dr Ivan Petrović, Doc. dr Ana Jovanović")
- `grade` - Ocjena: A, B, C, D, E, ili F
- `topic` - Tema rada (npr. "Machine Learning")
- `keywords` - Ključne riječi, odvojene zarezom (npr. "AI, Machine Learning, Neural Networks")
- `abstract` - Sažetak rada (kratak opis)
- `user_id` - ID korisnika (default: 1)

## Primjer CSV fajla:

```csv
first_name,last_name,title,type,year,file_url,mentor,committee_members,grade,topic,keywords,abstract,user_id
Marko,Marković,Primena mašinskog učenja,bachelors,2024,https://example.com/rad1.pdf,Prof. dr Ivan Petrović,"Prof. dr Ivan Petrović, Doc. dr Ana Jovanović",A,Machine Learning,"AI, Machine Learning","Ovaj rad istražuje primenu mašinskog učenja...",1
```

## Napomene:
- CSV fajl mora imati header red sa nazivima kolona
- Tekst koji sadrži zareze mora biti u navodnicima (npr. "Prof. A, Prof. B")
- Opcione kolone mogu biti prazne
- Tip rada mora biti: bachelors, masters ili specialist (malim slovima)
- Ocjena mora biti: A, B, C, D, E ili F (velikim slovima)

## Primjer fajla:
Pogledaj `example-theses.csv` za kompletan primjer.
