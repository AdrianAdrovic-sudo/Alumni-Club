import "../css/AlumniDirectory.css"

const alumniList = [
  {
    name: "Jane Doe",
    role: "FIT Grad",
    graduated: "Graduated: 2018",
    location: "Los Angeles, CA",
    image: "/path/to/jane.jpg",
  },
  {
    name: "Robert Johnson",
    role: "IT Solutions",
    graduated: "Graduated: 2019",
    location: "Chicago, IL",
    image: "/path/to/robert.jpg",
  },
  {
    name: "Emily Davis",
    role: "Alumni Rep",
    graduated: "Graduated: 2020",
    location: "Austin, TX",
    image: "/path/to/emily.jpg",
  },
  {
    name: "Alex Kim",
    role: "Innovate Labs",
    graduated: "Graduated: 2019",
    location: "Seattle, WA",
    image: "/path/to/alex.jpg",
  },
  {
    name: "Maria Hernandez",
    role: "Marketing Lead",
    graduated: "Graduated: 2021",
    location: "Miami, FL",
    image: "/path/to/maria.jpg",
  },
  {
    name: "Lucas Petrovic",
    role: "Data Analyst",
    graduated: "Graduated: 2020",
    location: "New York, NY",
    image: "/path/to/lucas.jpg",
  },
  {
    name: "Anya Singh",
    role: "Software Engineer",
    graduated: "Graduated: 2022",
    location: "San Francisco, CA",
    image: "/path/to/anya.jpg",
  },
  {
    name: "Chen Li",
    role: "Product Manager",
    graduated: "Graduated: 2017",
    location: "Boston, MA",
    image: "/path/to/chen.jpg",
  },
  {
    name: "Fatima Sayeed",
    role: "UX Designer",
    graduated: "Graduated: 2021",
    location: "Houston, TX",
    image: "/path/to/fatima.jpg",
  },
  {
    name: "Ivan Horvat",
    role: "Cybersecurity",
    graduated: "Graduated: 2018",
    location: "Zagreb, Croatia",
    image: "/path/to/ivan.jpg",
  },
  {
    name: "Linda Novak",
    role: "HR Lead",
    graduated: "Graduated: 2019",
    location: "Denver, CO",
    image: "/path/to/linda.jpg",
  },
  {
    name: "Mohammed Al-Farsi",
    role: "Cloud Architect",
    graduated: "Graduated: 2017",
    location: "Dubai, UAE",
    image: "/path/to/mohammed.jpg",
  },
];


const AlumniDirectory = () => (
  <div className="alumni-directory-root">
    <h2 className="alumni-title">Alumni Directory</h2>
      <br/>
        <h3 className="alumni-h3">Pregled svih Alumni Clanova</h3>
    <div className="alumni-grid">
      {alumniList.map((alum, idx) => (
        <div className="alumni-card" key={idx}>
          <img className="alumni-avatar" src={alum.image} alt={alum.name} />
          <div className="alumni-info">
            <div className="alumni-name">{alum.name}</div>
            <div className="alumni-role">{alum.role}</div>
            <div className="alumni-meta">{alum.graduated}</div>
            <div className="alumni-meta">{alum.location}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AlumniDirectory;