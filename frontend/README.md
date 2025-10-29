###FRONTEND###
#Početak: Instalirali smo React biblioteke koristeći Vite uz TypeScript, što je omogućilo brz i modularan razvoj modernog web projekta.

#Osnovna postavka: Kreirali smo osnovnu strukturu aplikacije, odvojili početnu (Home) stranicu i postavili Header i Footer kao posebne funkcionalne komponente, nakon čega smo ih povezali u glavni layout aplikacije.

#Debugovanje: Rješavali smo sve inicijalne greške i probleme sa prikazom i integracijom komponenti (posebno sa importima, rutiranjem, prikazom Home stranice, CSS konfliktima i sl.).

#Dodavanje stranica: Struktura je proširena sa novim stranicama – About Us, Alumni Directory i Blog, svaka sa svojim dizajnom i funkcijom.

#Autentikacija: Napravili smo login formu sa dugmetom za prikaz/skrivanje šifre i osnovnom validacijom ulaza.

#Refaktor: Trenutno smo u procesu prelaska kompletne CSS stilizacije na TailwindCSS, radi lakšeg održavanja i dosljednosti u dizajnu.

###Problemi i rešenja tokom razvoja
Import i export greške:
Povremeno su se pojavljivale greške tipa „no default export“ ili problemi sa importom slika i komponenti. Rešavali smo ih tako što smo vodili računa o tome da li koristimo export default ili named export, i u skladu s tim prilagođavali import sintaksu. Kod slika, uvek smo ih prvo uvozili putem import ime from 'putanja' pa prosleđivali kao promenljivu.

Problemi sa rutiranjem:
Na početku nije prikazivana Home stranica (/Home umesto /) ili se sadržaj nije menjao kako treba pri navigaciji. Rešenje je bilo prilagođavanje <Route path="/"> na odgovarajuću URL putanju i usklađivanje svi <Link to="..."> sa navedenim rutama.

React Router v6 kontekst greške:
Desilo se da <Link> komponenta baca grešku kada nije u okviru <BrowserRouter>. Dodali smo <BrowserRouter> oko celog App-a u main.jsx fajlu.

CSS override i prikaz komponenti:
Pojavljivale su se situacije da neki delovi stranice nisu bili vidljivi zbog loše postavljenih globalnih stilova ili kaskadiranja CSS-a. Prilagodili smo selektore, dodali !important po potrebi i koristili modularnost kroz posebne CSS fajlove za svaku komponentu.

TypeScript i asset import greške:
Kod importa slika često je iskakala greška "cannot find module...". Rešili smo to dodavanjem odgovarajućih deklaracija (\*.d.ts fajl za slike), čime smo omogućili TypeScript-u da prepozna asset import kao string.

Prilagođavanje dugmića i drugih elemenata iz eksternih biblioteka:
Gde god nije bilo moguće/poželjno koristiti spoljne biblioteke, implementirali smo custom dugmiće i elemente koristeći plain React i CSS.

Prelaz sa klasnih CSS fajlova na TailwindCSS:
Postepeno smo migrirali sa ručno pisanih CSS fajlova ka utility-first stilizaciji kroz Tailwind kako bi kod bio čistiji, pregledniji i responsivniji.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
