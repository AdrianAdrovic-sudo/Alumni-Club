import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

interface EventData {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
}

const PublicCalendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    fetch("/api/events?status=Published")
      .then(res => res.json())
      .then((data: EventData[]) => {
        const formatted = data.map(ev => ({
          id: ev.id.toString(),
          title: ev.title,
          start: ev.start_time,
          end: ev.end_time,
          extendedProps: { location: ev.location, description: ev.description },
        }));
        setEvents(formatted);
      });
  }, []);

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    fetch(`/api/events/${eventId}/calendar`)
      .then(res => {
        if (!res.ok) throw new Error("Ne mogu preuzeti calendar");
        return res.text();
      })
      .then(icsText => {
        const blob = new Blob([icsText], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `event_${eventId}.ics`;
        a.click();

        URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error(err);
        alert("Ne mogu preuzeti calendar");
      });
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
      />
    </div>
  );
};

export default PublicCalendar;