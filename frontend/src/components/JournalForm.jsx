import { useState } from "react";

export default function JournalForm({ initialData = {}, onSubmit }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [mood, setMood] = useState(initialData.mood || "Neutral");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, mood });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Write here..." value={content} onChange={e => setContent(e.target.value)} />
      <select value={mood} onChange={e => setMood(e.target.value)}>
        <option>Happy</option>
        <option>Calm</option>
        <option>Neutral</option>
        <option>Anxious</option>
        <option>Sad</option>
        <option>Mixed</option>
      </select>
      <button>Save</button>
    </form>
  );
}
