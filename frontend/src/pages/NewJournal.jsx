import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NewJournal() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("Neutral");

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await api.post("/journals", {
        title,
        content,
        mood,
      });
      navigate("/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Failed to save journal");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-serif mb-6">
          New Journal Entry
        </h1>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-[#E6EFEA] shadow-sm p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm mb-2">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this entry a name"
              required
              className="
                w-full px-4 py-3 rounded-xl border border-[#C9B8A6]
                bg-[#FAF7F2]
                focus:outline-none focus:ring-2 focus:ring-[#4F6F5B]
              "
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm mb-2">
              Reflection
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write here..."
              required
              rows={6}
              className="
                w-full px-4 py-3 rounded-xl border border-[#C9B8A6]
                bg-[#FAF7F2] resize-none
                focus:outline-none focus:ring-2 focus:ring-[#4F6F5B]
              "
            />
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm mb-2">
              Mood
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="
                px-4 py-2 rounded-xl border border-[#C9B8A6]
                bg-[#FAF7F2]
              "
            >
              <option>Sad</option>
              <option>Neutral</option>
              <option>Calm</option>
              <option>Happy</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                bg-[#4F6F5B] text-white px-6 py-2 rounded-full
                hover:opacity-90
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
