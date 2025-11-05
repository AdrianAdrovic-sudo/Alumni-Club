# Analytics Module

## Svrha modula
Ovaj modul prikazuje osnovne statistike Alumni Club platforme, uključujući:
- Ukupan broj članova
- Broj verifikovanih članova
- Broj blogova i novosti

Cilj je omogućiti brzi uvid u ključne metrike i vizualizaciju podataka kroz kartice i grafikone.

## Struktura fajlova
- `AnalyticsPage.tsx` → Glavna React komponenta za stranicu analytics
- `api.ts` → Servisni sloj koji trenutno vraća mock podatke
- Tailwind klase → Stilizacija layout-a i kartica

## Plan integracije sa backend-om u Sprintu 2
- Funkcija `getStats` će biti povezana sa pravim endpointom `/api/stats`  
- Frontend logika se neće menjati, samo će se zameniti mock podaci sa stvarnim JSON podacima sa servera