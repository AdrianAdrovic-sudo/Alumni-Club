import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Users, Info } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  visibility: "Public" | "Members" | "Private";
  status: "Draft" | "Published" | "Archived";
}

export default function PublicEventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Greška kod fetch-a:", err);
      }
    };

    load();
  }, [id]);

  if (!event)
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-600">
        Učitavanje...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white">
      {/* HEADER – identičan PublicEventList */}
      <div className="bg-linear-to-r from-[#294a70] to-[#324D6B] text-white py-20 px-5 text-center shadow-lg">
        <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
        <p className="text-xl opacity-90">Detalji javnog događaja</p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto py-16 px-5">
        <div className="bg-[#f9f9f9] rounded-2xl shadow-xl border border-gray-200 p-8 space-y-8">

          {/* DATUM */}
          <div className="flex items-center gap-2 text-[#294a70] font-semibold">
            <Calendar className="w-5 h-5 text-[#ffab1f]" />
            {new Date(event.start_time).toLocaleString("sr-RS", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" — "}
            {new Date(event.end_time).toLocaleString("sr-RS", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          {/* LOKACIJA */}
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-[#ffab1f]" />
            <span className="font-medium">{event.location}</span>
          </div>

          {/* OPIS */}
          <div>
            <h3 className="text-xl font-semibold text-[#294a70] mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#ffab1f]" />
              Opis događaja
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {event.description || "Ovaj događaj nema dodatni opis."}
            </p>
          </div>

          {/* CAPACITY */}
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#ffab1f]" />
            <p className="text-gray-800 font-medium">
              Kapacitet: {event.capacity} učesnika
            </p>
          </div>

          {/* RSVP placeholder */}
          <div className="mt-4 p-4 bg-white border border-gray-300 rounded-xl text-gray-600 italic">
            Funkcionalnost prijave na događaj (RSVP) biće dodata uskoro.
          </div>

          {/* BACK BUTTON — identičan stil kao dugme iz liste */}
          <Link
            to="/events"
            className="block text-center py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#294a70] to-[#324D6B] hover:from-[#ffab1f] hover:to-[#ff9500] transition-all shadow-md hover:shadow-xl"
          >
            ← Nazad na događaje
          </Link>
        </div>
      </div>
    </div>
  );
}
