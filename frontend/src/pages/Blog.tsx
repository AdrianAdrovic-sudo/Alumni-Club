// Blog.tsx (FULL FIXED)
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

type BlogPost = {
  id: number;
  title: string;
  category: string;
  short_desc: string;
  content: string;
  image_url?: string | null;
  read_time?: string | null;
  is_approved: boolean;
  is_deleted: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  users?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture?: string | null;
  } | null;
};

const POSTS_PER_PAGE = 4;
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL;

function resolvePostImageSrc(imageUrl?: string | null) {
  if (!imageUrl) return null;

  // If already absolute (http/https), return as-is
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  // If it's a relative path from backend (like /uploads/..), prefix it
  if (BACKEND_BASE_URL) return `${BACKEND_BASE_URL}${imageUrl}`;

  // Fallback (should not happen if env is configured)
  return imageUrl;
}

export default function Blog() {
  const { user, token } = useAuth();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Create post
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newShortDesc, setNewShortDesc] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newReadTime, setNewReadTime] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Pagination
  const [page, setPage] = useState(1);

  // Approve (admin)
  const [adminBusyId, setAdminBusyId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canCreate = Boolean(user && token);
  const isAdmin = user?.role === "admin";

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  }, [posts.length]);

  async function loadPosts() {
    try {
      if (!BACKEND_BASE_URL) {
        throw new Error("VITE_API_URL is not configured.");
      }

      setLoading(true);

      const res = await fetch(`${BACKEND_BASE_URL}/api/posts?limit=100`);
      if (!res.ok) {
        throw new Error("Ne mogu da učitam postove.");
      }

      const data = await res.json();

      // If your backend returns { posts: [...] } adjust accordingly.
      const list: BlogPost[] = Array.isArray(data) ? data : data.posts ?? [];

      // Filter out deleted if needed
      const visible = list.filter((p) => !p.is_deleted);

      // If non-admin, show only approved
      const finalList = isAdmin ? visible : visible.filter((p) => p.is_approved);

      // Sort newest first
      finalList.sort((a, b) => {
        const da = new Date(a.created_at ?? 0).getTime();
        const db = new Date(b.created_at ?? 0).getTime();
        return db - da;
      });

      setPosts(finalList);
      setPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function handleCreatePost() {
    try {
      if (!BACKEND_BASE_URL) throw new Error("VITE_API_URL is not configured.");
      if (!token) throw new Error("Niste prijavljeni.");

      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("category", newCategory);
      formData.append("short_desc", newShortDesc);
      formData.append("content", newContent);
      if (newReadTime) formData.append("read_time", newReadTime);

      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      const res = await fetch(`${BACKEND_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Neuspešno kreiranje posta.");
      }

      setShowCreate(false);
      setNewTitle("");
      setNewCategory("");
      setNewShortDesc("");
      setNewContent("");
      setNewReadTime("");
      setNewImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await loadPosts();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Greška pri kreiranju posta.");
    }
  }

  async function handleApprove(postId: number) {
    try {
      if (!BACKEND_BASE_URL) throw new Error("VITE_API_URL is not configured.");
      if (!token) throw new Error("Niste prijavljeni.");
      if (!isAdmin) throw new Error("Nemate dozvolu.");

      setAdminBusyId(postId);

      // If your backend uses a different approve endpoint, adjust here.
      const res = await fetch(`${BACKEND_BASE_URL}/api/posts/${postId}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Neuspešno odobravanje posta.");
      }

      await loadPosts();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Greška pri odobravanju.");
    } finally {
      setAdminBusyId(null);
    }
  }

  if (loading) {
    return <div className="p-6">Učitavanje...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-[#294a70]">Blog</h1>

        {canCreate && (
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="px-4 py-2 rounded-lg bg-[#294a70] text-white font-semibold hover:opacity-90"
          >
            {showCreate ? "Zatvori" : "Novi post"}
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mt-6 p-4 rounded-xl border bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="border rounded-lg p-2"
              placeholder="Naslov"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              className="border rounded-lg p-2"
              placeholder="Kategorija"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <input
              className="border rounded-lg p-2 md:col-span-2"
              placeholder="Kratak opis"
              value={newShortDesc}
              onChange={(e) => setNewShortDesc(e.target.value)}
            />
            <textarea
              className="border rounded-lg p-2 md:col-span-2 min-h-[120px]"
              placeholder="Sadržaj"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <input
              className="border rounded-lg p-2"
              placeholder="Read time (npr. 5 min)"
              value={newReadTime}
              onChange={(e) => setNewReadTime(e.target.value)}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="border rounded-lg p-2"
              onChange={(e) => setNewImageFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <button
            onClick={handleCreatePost}
            className="mt-4 px-4 py-2 rounded-lg bg-[#ffab1f] text-black font-semibold hover:opacity-90"
          >
            Objavi
          </button>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {paginatedPosts.map((post) => {
          const img = resolvePostImageSrc(post.image_url);
          const authorPfp =
            post.users?.profile_picture && BACKEND_BASE_URL
              ? `${BACKEND_BASE_URL}${post.users.profile_picture}?t=${Date.now()}`
              : "https://d22po4pjz3o32e.cloudfront.net/p/0";

          return (
            <div key={post.id} className="p-5 rounded-2xl bg-white shadow-sm border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#294a70]">{post.title}</h2>
                  <div className="text-sm text-gray-600 mt-1">
                    {post.category} {post.read_time ? `• ${post.read_time}` : ""}
                  </div>
                </div>

                {isAdmin && !post.is_approved && (
                  <button
                    disabled={adminBusyId === post.id}
                    onClick={() => handleApprove(post.id)}
                    className="px-3 py-2 rounded-lg bg-[#294a70] text-white font-semibold disabled:opacity-50"
                  >
                    {adminBusyId === post.id ? "..." : "Odobri"}
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <img
                  src={authorPfp}
                  alt="author"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="text-sm text-gray-700">
                  {post.users
                    ? `${post.users.first_name} ${post.users.last_name} (@${post.users.username})`
                    : "Nepoznat autor"}
                </div>
              </div>

              <p className="mt-4 text-gray-700">{post.short_desc}</p>

              {img && (
                <img
                  src={img}
                  alt="post"
                  className="mt-4 w-full max-h-[360px] object-cover rounded-xl border"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
        >
          Prethodna
        </button>
        <div className="text-sm text-gray-700">
          Strana {page} / {totalPages}
        </div>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-2 rounded-lg border disabled:opacity-50"
        >
          Sledeća
        </button>
      </div>
    </div>
  );
}
