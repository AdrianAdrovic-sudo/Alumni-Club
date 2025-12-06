import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  visibility: "Public" | "Members" | "Private";
  status: "Draft" | "Published" | "Archived";
}

export default function PublicEventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();

        setEvents(
          data.filter(
            (ev: Event) =>
              ev.visibility === "Public" && ev.status === "Published"
          )
        );
      } catch (err) {
        console.error("Greška kod fetch-a:", err);
      }
    };

    load();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* HEADER – isti stil kao MyProfile */}
      <div className="bg-linear-to-r from-[#294a70] to-[#324D6B] text-white py-20 px-5 text-center shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Javni događaji</h1>
        <p className="text-xl opacity-90">
          Pregled svih javno dostupnih alumni događaja
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto py-16 px-5">
        {events.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            Trenutno nema javnih događaja.
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#f9f9f9] rounded-2xl shadow-xl border border-gray-200 p-6 hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              {/* DATUM */}
              <div className="flex items-center gap-2 text-[#294a70] font-semibold mb-4">
                <Calendar className="w-5 h-5 text-[#ffab1f]" />
                {new Date(ev.start_time).toLocaleDateString("sr-RS", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* NASLOV */}
              <h2 className="text-2xl font-bold text-[#294a70] mb-2">
                {ev.title}
              </h2>

              {/* LOKACIJA */}
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <MapPin className="w-4 h-4 text-[#ffab1f]" />
                <span className="font-medium">{ev.location}</span>
              </div>

              {/* KRATAK OPIS (skraćen) */}
              <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {ev.description || "Ovaj događaj nema dodatni opis."}
              </p>

              {/* DUGME */}
              <Link
                to={`/events/${ev.id}`}
                className="block text-center py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#294a70] to-[#324D6B] hover:from-[#ffab1f] hover:to-[#ff9500] transition-all shadow-md hover:shadow-xl"
              >
                Detalji događaja
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
