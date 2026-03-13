# CSV Format za upload diplomskih radova

## Obavezne kolone:
- `first_name` - Ime studenta
- `last_name` - Prezime studenta
- `title` - Naziv diplomskog rada
- `title_language` - Jezik naslova (npr. `en`, `cg`)
- `type` - Tip rada: `bachelors`, `masters`, ili `specialist`
- `year` - Godina diplomiranja (broj)
- `mentor` - Ime mentora (npr. "Prof. dr Ivan Petrović") **OBAVEZNO**
- `topic` - Tema rada (npr. "Machine Learning") **OBAVEZNO**
- `keywords` - Ključne riječi, odvojene zarezom (npr. "AI, Machine Learning, Neural Networks") **OBAVEZNO**

## Opcione kolone (za prevod naslova):
- `subtitle` - Podnaslov rada
- `additional_title` - Dodatni naslov (prevod)
- `additional_subtitle` - Dodatni podnaslov (prevod)
- `additional_title_language` - Jezik dodatnog naslova (npr. `en`, `cg`)

## Opcione kolone (ostalo):
- `file_url` - URL do PDF fajla
- `committee_members` - Članovi komisije, odvojeni zarezom (npr. "Prof. dr Ivan Petrović, Doc. dr Ana Jovanović")
- `grade` - Ocjena: A, B, C, D, E, ili F
- `language` - Jezik rada (npr. `en`, `cg`)
- `abstract` - Sažetak rada (kratak opis)
- `defense_date` - Datum odbrane rada (format: YYYY-MM-DD HH:MM:SS ili ISO 8601)

## Primjer CSV fajla:

```csv
first_name,last_name,title,subtitle,title_language,additional_title,additional_subtitle,additional_title_language,type,year,file_url,mentor,committee_members,grade,topic,keywords,language,abstract,defense_date
Marko,Marković,Primena mašinskog učenja,,cg,Application of Machine Learning,,en,bachelors,2024,https://example.com/rad1.pdf,Prof. dr Ivan Petrović,"Prof. dr Ivan Petrović, Doc. dr Ana Jovanović",A,Machine Learning,"AI, Machine Learning, Neural Networks",cg,"Ovaj rad istražuje primenu mašinskog učenja...",2024-06-15 10:00:00
Ana,Jovanović,Deep Learning Applications,A Comprehensive Study,en,Primjena dubokog učenja,Sveobuhvatna studija,cg,masters,2024,https://example.com/rad2.pdf,Prof. dr Petar Petrović,"Prof. dr Petar Petrović, Doc. dr Marko Marković, Dr Ana Nikolić",A,Deep Learning,"Deep Learning, Neural Networks, AI",en,"This thesis explores deep learning applications...",2024-07-20 14:30:00
```

## Napomene:
- CSV fajl mora imati header red sa nazivima kolona
- Tekst koji sadrži zareze mora biti u navodnicima (npr. "Prof. A, Prof. B")
- **OBAVEZNA polja:** first_name, last_name, title, title_language, type, year, mentor, topic, keywords
- Opcione kolone mogu biti prazne
- Tip rada mora biti: bachelors, masters ili specialist (malim slovima)
- Ocjena mora biti: A, B, C, D, E ili F (velikim slovima)
- Datum odbrane mora biti u formatu: YYYY-MM-DD HH:MM:SS (npr. 2024-06-15 10:00:00)
- **user_id se automatski dodijeljuje i ne treba ga unositi u CSV**

## Primjer fajla:
Pogledaj `example-theses.csv` za kompletan primjer.
