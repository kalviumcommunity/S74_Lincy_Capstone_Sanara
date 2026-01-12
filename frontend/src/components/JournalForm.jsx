import { useState } from "react";

export default function JournalForm({ onSubmit, initialData = {} }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [mood, setMood] = useState(initialData.mood || "Neutral");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and reflection are required");
      return;
    }

    onSubmit({
      title,
      content,
      mood,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-lg font-medium border-b border-gray-300 focus:outline-none focus:border-[#4F6F5B]"
      />

      {/* Content */}
      <textarea
        placeholder="Write here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full resize-none text-gray-700 focus:outline-none"
      />

      {/* Mood + Save */}
      <div className="flex items-center justify-between">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="text-sm border rounded-md px-3 py-1"
        >
          <option>Sad</option>
          <option>Neutral</option>
          <option>Calm</option>
          <option>Happy</option>
        </select>

        <button
          type="submit"
          className="bg-[#4F6F5B] text-white px-5 py-2 rounded-full hover:opacity-90"
        >
          Save
        </button>
      </div>
    </form>
  );
}
