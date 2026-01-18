import React, { useState, useEffect } from "react";
import EventList from "../../pages/EventList";


interface Post {
  id: number;
  title: string;
  short_desc: string;
  content: string;
  category: string;
  read_time?: string | null;
  created_at: string;
  image_url?: string;
  users: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
  _count?: {
    comments: number;
    post_likes: number;
  };
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<"posts" | "events">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "posts") {
      loadPosts();
    }
  }, [activeTab]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/posts/pending", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message || "Neuspešno učitavanje objava.");
        return;
      }

      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Greška prilikom učitavanja objava:", error);
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId: number) => {
    if (!window.confirm("Da li ste sigurni da želite odobriti ovu objavu?"))
      return;

    try {
      const res = await fetch(`/api/posts/${postId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        alert(body?.message || "Neuspješno odobravanje objave.");
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      console.error(error);
      alert("Došlo je do greške prilikom odobravanja objave.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati ovu objavu?"))
      return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        alert(body?.message || "Neuspješno brisanje objave.");
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      console.error(error);
      alert("Došlo je do greške prilikom brisanja objave.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Upravljanje sadržajem
      </h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "posts"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Objave
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "events"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Događaji
          </button>
        </nav>
      </div>

      {/* POSTS TAB */}
      {activeTab === "posts" && (
        <>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Učitavanje objava...</p>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-600">Trenutno nema objava na čekanju.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.users.first_name} {post.users.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{post.users.username} •{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Kategorija: {post.category} •{" "}
                        {post.read_time || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprovePost(post.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{post.short_desc}</p>

                  <div
                    className="text-gray-700 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="max-w-xs rounded-lg mt-3"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* EVENTS TAB */}
      {activeTab === "events" && <EventList />}
    </div>
  );
}
