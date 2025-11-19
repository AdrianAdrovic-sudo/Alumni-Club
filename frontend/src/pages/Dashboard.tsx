import React, { useState } from "react";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "moderator" | "alumni";
}

interface Event {
  id: number;
  title: string;
  date: string;
  status: "upcoming" | "past";
}

const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "alumni" },
];

const mockEvents: Event[] = [
  { id: 1, title: "Annual Meetup", date: "2025-12-10", status: "upcoming" },
  { id: 2, title: "Alumni Webinar", date: "2025-06-20", status: "past" },
];

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 bg-navy-900 text-white w-64 p-6 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex-shrink-0`}
        aria-label="Main Navigation"
      >
        <div className="text-xl text-black font-bold mb-8">Mediteran Alumni Club</div>
        <ul className="space-y-4">
          <li>
            <a
              href="#users"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              {/* Icons omitted for brevity */}
              Users
            </a>
          </li>
          <li>
            <a
              href="#events"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              Events
            </a>
          </li>
          <li>
            <a
              href="#news"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              News
            </a>
          </li>
          <li>
            <a
              href="#stats"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              Statistics
            </a>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <button
            className="md:hidden text-navy-900 hover:text-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            &#9776;
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div>
            <button
              className="text-sm px-4 py-2 rounded bg-navy-700 text-white hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="User menu"
            >
              Admin
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* User management */}
          <section id="users" aria-labelledby="users-heading">
            <h2
              id="users-heading"
              className="text-xl font-semibold mb-4 text-navy-900"
            >
              User Management
            </h2>
            <input
              type="search"
              placeholder="Search users..."
              className="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-gold-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search users"
            />
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white">
                <thead className="bg-navy-700 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Role</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4 capitalize">{user.role}</td>
                      <td className="py-2 px-4 text-center space-x-2">
                        <button
                          className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-400"
                          aria-label={`Edit user ${user.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
                          aria-label={`Delete user ${user.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-gray-500 italic"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Event management */}
          <section id="events" aria-labelledby="events-heading">
            <h2
              id="events-heading"
              className="text-xl font-semibold mb-4 text-navy-900"
            >
              Event Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow p-4 border-l-4 border-gold-400"
                  role="region"
                  aria-label={`Event ${event.title}`}
                >
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                  <p
                    className={`mt-2 font-semibold ${
                      event.status === "upcoming"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </p>
                  <div className="mt-4 space-x-4">
                    <button
                      className="px-3 py-1 rounded bg-navy-700 text-white hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
                      aria-label={`Edit event ${event.title}`}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label={`Delete event ${event.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* News and announcements */}
          <section id="news" aria-labelledby="news-heading">
            <h2
              id="news-heading"
              className="text-xl font-semibold mb-4 text-navy-900"
            >
              News & Announcements
            </h2>
            <article className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-lg font-bold">Welcome to the Alumni Club Portal</h3>
              <p className="mt-2 text-gray-700">
                Stay connected, participate in events, and share your achievements with fellow alumni.
              </p>
            </article>
            {/* Add dynamic news list here */}
          </section>

          {/* Statistics overview */}
          <section id="stats" aria-labelledby="stats-heading">
            <h2
              id="stats-heading"
              className="text-xl font-semibold mb-4 text-navy-900"
            >
              Statistics Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-lg shadow p-4"
                role="region"
                aria-label="Alumni Engagement Chart"
              >
                <h3 className="font-bold mb-2">Alumni Engagement</h3>
                {/* Placeholder for chart */}
                <div className="h-48 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-gray-400">
                  Chart here
                </div>
              </div>
              <div
                className="bg-white rounded-lg shadow p-4"
                role="region"
                aria-label="Event Attendance Chart"
              >
                <h3 className="font-bold mb-2">Event Attendance</h3>
                {/* Placeholder for chart */}
                <div className="h-48 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-gray-400">
                  Chart here
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
