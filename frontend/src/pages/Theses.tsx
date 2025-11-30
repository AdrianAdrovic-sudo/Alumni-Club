import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function DiplomskiRadovi() {
  const [searchTerm, setSearchTerm] = useState("");

  const podaci = [
    { ime: "Miloš", prezime: "Žižić", naziv: "Informacioni sistem Rent-a cara", datum: "10.07.2009." },
    { ime: "Tripo", prezime: "Matijević", naziv: "Prikupljanje činjenica za informacioni sistem studentske službe", datum: "10.07.2009." },
    { ime: "Zoran", prezime: "Ćorović", naziv: "Model, objekti i veze informacionog sistema studentske službe", datum: "10.07.2009." },
    { ime: "Dženan", prezime: "Strujić", naziv: "Relacioni model informacionog sistema studentske službe", datum: "10.07.2009." },
    { ime: "Novak", prezime: "Radulović", naziv: "Forme i izvještaj informacionog sistema studentske službe", datum: "10.07.2009." },
    { ime: "Igor", prezime: "Pekić", naziv: "Sigurnost informacionog sistema studentske službe", datum: "10.07.2009." },
    { ime: "Ana", prezime: "Jovanović", naziv: "Web aplikacija za studentsku službu", datum: "10.07.2009." },
    { ime: "Jelena", prezime: "Marković", naziv: "Implementacija informacionog sistema studentske službe", datum: "10.07.2009." },
    { ime: "Marko", prezime: "Nikolić", naziv: "Testiranje informacionog sistema studentske službe", datum: "10.07.2009." },
    { ime: "Ivana", prezime: "Stojanović", naziv: "Održavanje informacionog sistema studentske službe", datum: "10.07.2009." },
  ];

  const filtrirani = podaci.filter(
    (p) =>
      p.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.naziv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* HERO */}
      <div className="bg-gradient-to-br from-[#294a70] to-[#324D6B] text-white px-4 py-16 md:py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Diplomski radovi
        </h1>
        <p className="text-base md:text-lg opacity-90 max-w-3xl mx-auto">
          Pregledajte bazu diplomskih radova naših studenata. Koristite
          pretragu da biste brzo pronašli radove po imenu, prezimenu ili
          nazivu rada.
        </p>
      </div>

      {/* SEARCH */}
      <div className="w-full flex justify-end px-4 md:px-16 mt-8">
        <div className="flex items-center w-full sm:w-96">
          <div className="flex items-center justify-center px-3 py-2 bg-white border border-r-0 border-gray-300 rounded-l-md">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Pretraga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 h-[45px] border border-gray-300 border-l-0 rounded-r-md text-sm md:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffab1f] focus:border-[#ffab1f]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full flex-1 flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-6xl shadow-md rounded-2xl overflow-hidden bg-white">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-[#294a70] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Ime
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Prezime
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Naziv diplomskog rada
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Datum diplomiranja
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrirani.map((p, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {p.ime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {p.prezime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {p.naziv}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {p.datum}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
