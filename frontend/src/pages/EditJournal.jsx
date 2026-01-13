import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import MoodSelector from "../components/MoodSelector";

export default function EditJournal() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Core fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // FIXED: mood is STRING
  const [mood, setMood] = useState("Calm");

  const [energyLevel, setEnergyLevel] = useState(2);
  const [context, setContext] = useState("Personal");

  // Tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- FETCH JOURNAL ---------- */
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await api.get(`/journals/${id}`);

        setTitle(res.data.title);
        setContent(res.data.content);
        setMood(res.data.mood);              // ✅ STRING
        setEnergyLevel(res.data.energy ?? 2);
        setContext(res.data.context ?? "Personal");
        setTags(res.data.tags ?? []);
      } catch {
        setError("Unable to load journal entry.");
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [id]);

  /* ---------- TAG HELPERS ---------- */
  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase();
    if (!cleaned || tags.includes(cleaned)) return;
    setTags([...tags, cleaned]);
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  /* ---------- SAVE ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/journals/${id}`, {
        title,
        content,
        mood,              // ✅ STRING
        energy: energyLevel,
        context,
        tags,
        isDraft: false,
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
    <div className="min-h-screen bg-[#FAF7F2] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-serif text-[#2F3E34] mb-2">
          Edit Journal Entry
        </h1>
        <p className="text-sm text-[#7A8A80] mb-8">
          Refine your entry while keeping its original context.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E6EFEA] shadow-sm p-8 space-y-8"
        >
          {/* Title */}
          <div>
            <label className="block text-sm mb-2">
              About your day
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-[#FAF7F2]"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm mb-2">
              What’s on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] resize-none"
              required
            />
          </div>

          {/* Mood */}
          <MoodSelector value={mood} onChange={setMood} />

          {/* Energy */}
          <div>
            <label className="block text-sm mb-2">
              Energy level:{" "}
              <span className="text-[#4F6F5B]">{energyLevel}</span> / 3
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={energyLevel}
              onChange={(e) =>
                setEnergyLevel(Number(e.target.value))
              }
              className="w-full accent-[#4F6F5B]"
            />
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm mb-2">
              Context
            </label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-[#FAF7F2]"
            >
              <option>Work</option>
              <option>Sleep</option>
              <option>Social</option>
              <option>Health</option>
              <option>Personal</option>
              <option>Other</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm mb-2">
              Emotional tags
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 bg-[#E6EFEA] px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. anxious"
                className="flex-1 px-4 py-2 rounded-xl border bg-[#FAF7F2]"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 rounded-xl bg-[#4F6F5B] text-white"
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-[#4F6F5B] text-white px-6 py-2 rounded-full"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-sm text-[#7A8A80]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
