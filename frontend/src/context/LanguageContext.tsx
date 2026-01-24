import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'sr' | 'en';

type TranslationKeys = {
  // Header translations
  'header.about': string;
  'header.alumni': string;
  'header.blog': string;
  'header.contact': string;
  'header.theses': string;
  'header.events': string;
  'header.welcome': string;
  'header.inbox': string;
  'header.profile': string;
  'header.dashboard': string;
  'header.logout': string;
  'header.login': string;
  'header.myProfile': string;
  
  // AboutUs translations
  'aboutus.title': string;
  'aboutus.subtitle': string;
  'aboutus.howItStarted': string;
  'aboutus.howItStartedText1': string;
  'aboutus.howItStartedText2': string;
  'aboutus.ourMission': string;
  'aboutus.ourMissionText1': string;
  'aboutus.ourMissionText2': string;
  'aboutus.whatWeOffer': string;
  'aboutus.whatWeOfferText': string;
  'aboutus.feature1': string;
  'aboutus.feature2': string;
  'aboutus.feature3': string;
  'aboutus.ourNumbers': string;
  'aboutus.ourNumbersSubtitle': string;
  'aboutus.label1': string;
  'aboutus.label2': string;
  'aboutus.label3': string;
  'aboutus.label4': string;
  'aboutus.ourValues': string;
  'aboutus.ourValuesSubtitle': string;
  'aboutus.value1.title': string;
  'aboutus.value1.text': string;
  'aboutus.value2.title': string;
  'aboutus.value2.text': string;
  'aboutus.value3.title': string;
  'aboutus.value3.text': string;
  'aboutus.value4.title': string;
  'aboutus.value4.text': string;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation objects
const translations: Record<Language, TranslationKeys> = {
  sr: {
    // Header translations
    'header.about': 'O nama',
    'header.alumni': 'Alumnisti',
    'header.blog': 'Blog',
    'header.contact': 'Kontakt',
    'header.theses': 'Diplomski radovi',
    'header.events': 'Događaji',
    'header.welcome': 'Dobrodošao/la',
    'header.inbox': 'Inbox',
    'header.profile': 'Profil',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Odjavi se',
    'header.login': 'Prijavi se',
    'header.myProfile': 'Moj profil',
    
    // AboutUs translations
    'aboutus.title': 'O Nama',
    'aboutus.subtitle': 'Alumni zajednica Fakulteta za informacione tehnologije',
    'aboutus.howItStarted': 'Kako je nastao Alumni Klub',
    'aboutus.howItStartedText1': 'Alumni FIT je nastao kao projekat koji su realizovali studenti 3. godine Fakulteta za informacione tehnologije. Ono što je počelo kao obična ideja u učionici, preraslo je u pravu digitalnu revoluciju koja povezuje generacije studenata.',
    'aboutus.howItStartedText2': 'Ono što je počelo kao studentski projekat, preraslo je u vitalni alat za networking koji povezuje generacije studenata i profesionalaca širom svijeta. Danas smo ponosni na našu zajednicу koja raste svakim danom.',
    'aboutus.ourMission': 'Naša Misija',
    'aboutus.ourMissionText1': 'Alumni FIT je platforma koja povezuje bivše studente i stvara mostove između akademskog svijeta i industrije. Mi vjerujemo da svaki student zaslužuje podršku i priliku da ostvari svoje snove.',
    'aboutus.ourMissionText2': 'Vjerujemo u snagu zajednice i želimo da svaki alumni član ima pristup resursima, mentorstvu i mogućnostima koje će im pomoći da napreduju u karijeri. Zajedno smo jači.',
    'aboutus.whatWeOffer': 'Šta Nudimo',
    'aboutus.whatWeOfferText': 'Kroz našu platformu možete pronaći stare kolege, pratiti njihovu karijeru, dijeliti iskustva i učiti jedni od drugih. Od networking događaja do mentorskih programa - imamo sve što vam treba.',
    'aboutus.feature1': 'Moderna platforma za povezivanje',
    'aboutus.feature2': 'Ekskluzivni eventi i meetup-ovi',
    'aboutus.feature3': 'Karijerni savjeti i job board',
    'aboutus.ourNumbers': 'Naši Brojevi',
    'aboutus.ourNumbersSubtitle': 'Statistike koje govore o našem uspjehu',
    'aboutus.label1': 'Alumni članova',
    'aboutus.label2': 'Kompanija',
    'aboutus.label3': 'Država',
    'aboutus.label4': 'Godina tradicije',
    'aboutus.ourValues': 'Naše Vrijednosti',
    'aboutus.ourValuesSubtitle': 'Principi koji nas vode u svemu što radimo',
    'aboutus.value1.title': 'Povezanost',
    'aboutus.value1.text': 'Gradimo mostove između generacija i profesionalaca',
    'aboutus.value2.title': 'Inovacija',
    'aboutus.value2.text': 'Podsticanje kreativnosti i novih ideja',
    'aboutus.value3.title': 'Obrazovanje',
    'aboutus.value3.text': 'Kontinuirano učenje i razvoj',
    'aboutus.value4.title': 'Izvrsnost',
    'aboutus.value4.text': 'Težnja ka vrhunskim rezultatima'
  },
  en: {
    // Header translations
    'header.about': 'About Us',
    'header.alumni': 'Alumni',
    'header.blog': 'Blog',
    'header.contact': 'Contact',
    'header.theses': 'Theses',
    'header.events': 'Events',
    'header.welcome': 'Welcome',
    'header.inbox': 'Inbox',
    'header.profile': 'Profile',
    'header.dashboard': 'Dashboard',
    'header.logout': 'Logout',
    'header.login': 'Login',
    'header.myProfile': 'My Profile',
    
    // AboutUs translations
    'aboutus.title': 'About Us',
    'aboutus.subtitle': 'Alumni community of the Faculty of Information Technology',
    'aboutus.howItStarted': 'How Alumni Club Started',
    'aboutus.howItStartedText1': 'Alumni FIT was created as a project realized by 3rd year students of the Faculty of Information Technology. What started as a simple idea in the classroom has grown into a real digital revolution connecting generations of students.',
    'aboutus.howItStartedText2': 'What began as a student project has grown into a vital networking tool that connects generations of students and professionals around the world. Today we are proud of our community that grows every day.',
    'aboutus.ourMission': 'Our Mission',
    'aboutus.ourMissionText1': 'Alumni FIT is a platform that connects former students and creates bridges between the academic world and industry. We believe that every student deserves support and the opportunity to achieve their dreams.',
    'aboutus.ourMissionText2': 'We believe in the power of community and want every alumni member to have access to resources, mentorship and opportunities that will help them advance in their careers. Together we are stronger.',
    'aboutus.whatWeOffer': 'What We Offer',
    'aboutus.whatWeOfferText': 'Through our platform you can find old colleagues, follow their careers, share experiences and learn from each other. From networking events to mentorship programs - we have everything you need.',
    'aboutus.feature1': 'Modern platform for networking',
    'aboutus.feature2': 'Exclusive events and meetups',
    'aboutus.feature3': 'Career advice and job board',
    'aboutus.ourNumbers': 'Our Numbers',
    'aboutus.ourNumbersSubtitle': 'Statistics that speak about our success',
    'aboutus.label1': 'Alumni members',
    'aboutus.label2': 'Companies',
    'aboutus.label3': 'Countries',
    'aboutus.label4': 'Years of tradition',
    'aboutus.ourValues': 'Our Values',
    'aboutus.ourValuesSubtitle': 'Principles that guide us in everything we do',
    'aboutus.value1.title': 'Connection',
    'aboutus.value1.text': 'Building bridges between generations and professionals',
    'aboutus.value2.title': 'Innovation',
    'aboutus.value2.text': 'Encouraging creativity and new ideas',
    'aboutus.value3.title': 'Education',
    'aboutus.value3.text': 'Continuous learning and development',
    'aboutus.value4.title': 'Excellence',
    'aboutus.value4.text': 'Striving for outstanding results'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('sr');

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}