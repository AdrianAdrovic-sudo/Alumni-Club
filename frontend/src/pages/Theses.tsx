import { FaSearch } from "react-icons/fa"; 
import "../css/Theses.css";
import { useState } from 'react';

export default function DiplomskiRadovi() {
  const [searchTerm, setSearchTerm] = useState("");

  const podaci = [
    {ime: "Miloš", prezime: "Žižić", naziv: "Informacioni sistem Rent-a cara", datum: "10.07.2009." },
    {ime: "Tripo", prezime: "Matijević", naziv: "Prikupljanje činjenica za informacioni sistem studentske službe", datum: "10.07.2009." },
    {ime: "Zoran", prezime: "Ćorović", naziv: "Model, objekti i veze informacionog sistema studentske službe", datum: "10.07.2009." },
    {ime: "Dženan", prezime: "Strujić", naziv: "Relacioni model informacionog sistema studentske službe", datum: "10.07.2009." },
    {ime: "Novak", prezime: "Radulović", naziv: "Forme i izvještaj informacionog sistema studentske službe", datum: "10.07.2009." },
    {ime: "Igor", prezime: "Pekić", naziv: "Sigurnost informacionog sistema studentske službe", datum: "10.07.2009." },
    {ime: "Ana", prezime: "Jovanović", naziv: "Web aplikacija za studentsku službu", datum: "10.07.2009." },
    {ime: "Jelena", prezime: "Marković", naziv: "Implementacija informacionog sistema studentske službe", datum: "10.07.2009." },
    {ime: "Marko", prezime: "Nikolić", naziv: "Testiranje informacionog sistema studentske službe", datum: "10.07.2009." },
    {ime: "Ivana", prezime: "Stojanović", naziv: "Održavanje informacionog sistema studentske službe", datum: "10.07.2009." },
  ];

  const filtrirani = podaci.filter(
    (p) =>
      p.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.naziv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="theses-container">
        <div className="theses-hero">
        <h1 >Diplomski radovi </h1>
            <p>
                Pregledajte bazu diplomskih radova naših studenata. Koristite pretragu da biste brzo pronašli radove po imenu, prezimenu ili nazivu rada.
            </p><br></br>
        </div>
     

      <div className="search-container">
        <input type="text" placeholder="Pretraga..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="table-wrapper">
      <table>
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Naziv diplomskog rada</th>
            <th>Datum diplomiranja</th>
          </tr>
        <tbody>
          {filtrirani.map((p) => (
            <tr>
              <td>{p.ime}</td>
              <td>{p.prezime}</td>
              <td>{p.naziv}</td>
              <td>{p.datum}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}