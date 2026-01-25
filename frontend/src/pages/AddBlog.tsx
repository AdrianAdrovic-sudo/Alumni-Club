import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const AddBlog = () => {
  const navigate = useNavigate();

  const TINYMCE_KEY = import.meta.env.VITE_TINYMCE_API_KEY || "";

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    image: "",
    readTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Pripremi payload koji backend očekuje
    const payload = {
      title: formData.title,
      category: formData.category,
      imageUrl: formData.image, // image -> imageUrl
      readTime: formData.readTime,
      shortDesc: formData.description, // description -> shortDesc
      content: formData.content,
    };

    console.log("Blog payload:", payload);

    try {
      // 2) Uzmemo token (prilagodi ključ ako kod vas drugačije)
      const token = localStorage.getItem("token");

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // 3) Ako nije uspjelo – ispiši grešku i ne radi redirect
      if (!res.ok) {
        let errBody: any = null;
        try {
          errBody = await res.json();
        } catch (_) {}

        console.error("Greška pri kreiranju bloga:", res.status, errBody);
        alert(errBody?.message || "Neuspješno kreiranje blog posta.");
        return;
      }

      const created = await res.json();
      console.log("Kreirani post:", created);

      // 4) Ako je sve ok – redirect na listu blogova
      navigate("/Blog");
    } catch (err) {
      console.error("Network/JS greška pri kreiranju bloga:", err);
      alert("Došlo je do greške prilikom slanja bloga.");
    }
  };

  const handleCancel = () => {
    navigate("/Blog");
  };

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-gradient-to-br from-[#324D6B] to-[#2a3f56] min-h-[calc(100vh-200px)]">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Kreiraj novi blog post
          </h1>
          <p className="text-gray-300">
            Popunite detalje ispod da biste kreirali novi blog post
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-gray-700 font-semibold mb-2 text-base"
            >
              Naslov bloga <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              placeholder="Unesite naslov bloga"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-gray-700 font-semibold mb-2 text-base"
            >
              Kategorija <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            >
              <option value="">Izaberite kategoriju</option>
              <option value="Technology">Tehnologija</option>
              <option value="Business">Biznis</option>
              <option value="Lifestyle">Životni stil</option>
              <option value="Education">Obrazovanje</option>
              <option value="Career">Karijera</option>
              <option value="Other">Ostalo</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-gray-700 font-semibold mb-2 text-base"
            >
              URL slike <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="readTime"
              className="block text-gray-700 font-semibold mb-2 text-base"
            >
              Vrijeme čitanja <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              placeholder="npr. 5 min čitanja"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-2 text-base"
            >
              Kratki opis <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] font-inherit"
              placeholder="Kratki opis blog posta"
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="content"
              className="block text-gray-700 font-semibold mb-2 text-base"
            >
              Sadržaj bloga <span className="text-red-500">*</span>
            </label>

            {/* If key is missing, we still render, but TinyMCE will show setup nag */}
            <Editor
              apiKey={TINYMCE_KEY || "no-api-key"}
              value={formData.content}
              onEditorChange={handleEditorChange}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "lists",
                  "link",
                  "image",
                  "code",
                  "table",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | link image | code | removeformat",
                content_style:
                  'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px }',
                placeholder: "Napišite sadržaj vašeg bloga ovdje...",
              }}
            />

            {!TINYMCE_KEY && (
              <p className="mt-2 text-sm text-red-600">
                Nedostaje VITE_TINYMCE_API_KEY u frontend/.env. TinyMCE će prikazati
                setup ekran dok ne dodate ključ.
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Objavi blog
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddBlog;
