import { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import api from "../services/api";
import MoodSelector from "../components/MoodSelector";

export default function NewJournal() {
  const navigate = useNavigate();

  // Core fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // FIXED: mood is STRING (no mapping bugs)
  const [mood, setMood] = useState("Calm");

  const [energyLevel, setEnergyLevel] = useState(2);
  const [context, setContext] = useState("Personal");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [savingDraft, setSavingDraft] = useState(false);

  /* ---------- FRAMER MOTION PRESETS ---------- */
  const pageFade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const liftFade = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } },
  };

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
  const saveJournal = async (isDraft = false) => {
    if (!title.trim() || !content.trim()) return;

    const payload = {
      title,
      content,
      mood,
      energy: energyLevel,
      context,
      tags,
      isDraft,
    };

    try {
      if (isDraft) setSavingDraft(true);
      await api.post("/journals", payload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#FAF7F2] px-6 py-12"
      variants={pageFade}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-serif text-[#2F3E34] mb-2">
            New Journal Entry
          </h1>
          <p className="text-sm text-[#7A8A80]">
            A quiet space to reflect and write honestly.
          </p>
        </header>

        {/* Card */}
        <motion.div
          className="bg-white rounded-3xl border border-[#D8E3DD] p-8"
          variants={liftFade}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="space-y-10"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Title */}
            <motion.div variants={liftFade}>
              <label className="block text-sm mb-2 text-[#2F3E34]">
                About your day
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A few words about today…"
                className="w-full px-4 py-3 rounded-xl border bg-[#FAF7F2]"
              />
            </motion.div>

            {/* Content */}
            <motion.div variants={liftFade}>
              <label className="block text-sm mb-2 text-[#2F3E34]">
                What’s on your mind?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Write freely. This space is yours."
                className="w-full px-4 py-3 rounded-xl border bg-[#FAF7F2] resize-none"
              />
            </motion.div>

            {/* Mood */}
            <motion.div variants={liftFade}>
              <MoodSelector value={mood} onChange={setMood} />
            </motion.div>

            {/* Energy */}
            <motion.div variants={liftFade}>
              <label className="block text-sm mb-2 text-[#2F3E34]">
                Energy level: {energyLevel}/3
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-[#4F6F5B]"
              />
            </motion.div>

            {/* Context */}
            <motion.div variants={liftFade}>
              <label className="block text-sm mb-2 text-[#2F3E34]">
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
            </motion.div>

            {/* Tags */}
            <motion.div variants={liftFade}>
              <label className="block text-sm mb-2 text-[#2F3E34]">
                Tags
              </label>

              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. moviedate"
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

              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#E6EFEA] px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={liftFade}
              className="flex justify-between pt-4"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={savingDraft}
                onClick={() => saveJournal(true)}
                className="text-sm text-[#7A8A80]"
              >
                {savingDraft ? "Saving draft…" : "Save as draft"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => saveJournal(false)}
                className="bg-[#4F6F5B] text-white px-8 py-2 rounded-full"
              >
                Save entry
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
