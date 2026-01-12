import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";


const moodMap = {
  1: "Sad",
  2: "Neutral",
  3: "Calm",
  4: "Happy",
};

const reverseMoodMap = {
  Sad: 1,
  Neutral: 2,
  Calm: 3,
  Happy: 4,
};

export default function EditJournal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodValue, setMoodValue] = useState(2);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await api.get(`/journals/${id}`);

        setTitle(res.data.title);
        setContent(res.data.content);
        setMoodValue(reverseMoodMap[res.data.mood] ?? 2);
      } catch {
        setError("Unable to load journal entry.");
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/journals/${id}`, {
        title,
        content,
        mood: moodMap[moodValue],
      });
      navigate("/dashboard");
    } catch {
      setError("Failed to save changes.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center text-gray-500">
        Loading journal entry…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 px-6">
      <div className="bg-white border rounded-xl p-8">
        <h1 className="text-2xl font-serif mb-2">
          Edit Journal Entry
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Refine your entry while keeping its original context.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4F6F5B]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Reflection
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-40 resize-none focus:ring-2 focus:ring-[#4F6F5B]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Mood Slider */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Mood: <span className="text-[#4F6F5B]">{moodMap[moodValue]}</span>
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={moodValue}
              onChange={(e) => setMoodValue(Number(e.target.value))}
              className="w-full accent-[#4F6F5B]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Sad</span>
              <span>Neutral</span>
              <span>Calm</span>
              <span>Happy</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-[#4F6F5B] text-white px-5 py-2 rounded-lg hover:bg-[#405C4C]"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
