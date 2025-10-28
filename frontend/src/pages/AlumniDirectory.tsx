import React from 'react';
import '../css/Home.css';

function Home() {
  return (
    <main className="home-main-content">
      {/* Aktuelno Section */}
      <section className="aktu-section">
        <div className="aktu-title">
          Aktuelno
          
        </div>
        <div className="aktu-cards">
          {[1,2,3].map(num => (
            <div className="aktu-card" key={num}>
              <div className="aktu-card-title">vijest{num}</div>
              <div className="aktu-card-desc">Opis vijesti...</div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Section Below Aktuelno */}
      <section className="editorial-section">
        <div className="editorial-content">
          <div className="editorial-left">
            <p>
              FIT-a kao osnivači Alumni kluba! Prvi pravi ciljevi i studentske inicijative za umrežavanje i razvoj IT sektora u Crnoj Gori.
            </p>
            <button>Više informacija</button>
          </div>
          <div className="editorial-image">
            <img src="/src/assets/edit-img.jpg" alt="Alumni event" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
