import '../css/AboutUs.css';

function AboutUs() {
  return(
    <div className="about-us-container">
      <div className="about-us-hero">
        <h1>O Nama</h1>
        <p className="hero-subtitle">Alumni zajednica Fakulteta za informacione tehnologije</p>
      </div>

      <div className="about-us-content">
        <div className="about-section">
          <div className="about-text">
            <h2>Kako je nastao Alumni Klub</h2>
            <p>
              Alumni FIT je nastao kao projekat koji su realizovali studenti 3. godine Fakulteta za 
              informacione tehnologije na Univerzitetu Mediteran. Projekat je razvijen u okviru predmeta 
              Distribuirani razvoj softvera, sa ciljem da kreira platformu koja će dugoročno služiti 
              povezivanju bivših studenata i akademske zajednice.
            </p>
            <p>
              Ono što je počelo kao studentski projekat, preraslo je u vitalni alat za networking, 
              razmjenu znanja i profesionalni razvoj svih generacija FIT-a.
            </p>
          </div>
         
        </div>

        <div className="about-section reverse">
          
          <div className="about-text">
            <h2>Naša Misija</h2>
            <p>
              Alumni FIT je platforma koja povezuje bivše studente Fakulteta za informacione tehnologije 
              Univerziteta Mediteran. Naš cilj je da izgradimo snažnu mrežu profesionalaca koji će 
              podržavati jedni druge, dijeliti iskustva i pomoći novim generacijama studenata.
            </p>
            <p>
              Vjerujemo u snagu zajednice i želimo da svaki alumni član ima pristup resursima, 
              mentorstvu i prilikama koje će im pomoći da ostvare svoje profesionalne ciljeve.
            </p>
          </div>
        </div>

        <div className="about-section reverse">
          
          <div className="about-text">
            <h2>Šta Nudimo</h2>
            <p>
              Kroz našu platformu možete pronaći stare kolege, pratiti njihovu karijeru, 
              učestvovati u networking događajima, pristupiti mentorskim programima i 
              ostati povezani sa fakultetom i njegovim aktivnostima.
            </p>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h3>500+</h3>
            <p>Alumni članova</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Kompanija</p>
          </div>
          <div className="stat-card">
            <h3>20+</h3>
            <p>Država</p>
          </div>
          <div className="stat-card">
            <h3>15+</h3>
            <p>Godina tradicije</p>
          </div>
        </div>

        <div className="values-section">
          <h2>Naše Vrijednosti</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Povezanost</h3>
              <p>Gradimo mostove između generacija i profesionalaca</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Inovacija</h3>
              <p>Podsticanje kreativnosti i novih ideja</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>Obrazovanje</h3>
              <p>Kontinuirano učenje i razvoj</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Izvrsnost</h3>
              <p>Težnja ka vrhunskim rezultatima</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;