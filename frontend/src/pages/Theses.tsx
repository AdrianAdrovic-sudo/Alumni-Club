import { useEffect, useState } from "react";

interface DiplomskiRad {
  ime: string;
  prezime: string;
  naziv: string;
  datum: string;
  pdfUrl?: string; // opcionalno, ako postoji PDF verzija
}

export default function DiplomskiRadovi() {
  const [searchTerm, setSearchTerm] = useState("");
  const [radovi, setRadovi] = useState<DiplomskiRad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Zamijeni URL sa svojim endpointom za diplomce
    fetch("/api/diplomski-radovi")
      .then((res) => res.json())
      .then((data: DiplomskiRad[]) => {
        setRadovi(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju diplomskih radova:", err);
        setLoading(false);
      });
  }, []);

  const filtrirani = radovi.filter(
    (p) =>
      p.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.naziv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="theses-container">
      <div className="theses-hero">
        <h1>Diplomski radovi</h1>
        <p>
          Pregledajte bazu diplomskih radova naših studenata. Koristite pretragu da biste brzo pronašli radove po imenu, prezimenu ili nazivu rada.
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Pretraga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center mt-6">Učitavanje...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ime</th>
                <th>Prezime</th>
                <th>Naziv diplomskog rada</th>
                <th>Datum diplomiranja</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {filtrirani.map((p, i) => (
                <tr key={i}>
                  <td>{p.ime}</td>
                  <td>{p.prezime}</td>
                  <td>{p.naziv}</td>
                  <td>{p.datum}</td>
                  <td>
                    {p.pdfUrl ? (
                      <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer">
                        Pogledaj PDF
                      </a>
                    ) : (
                      "Nema"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
