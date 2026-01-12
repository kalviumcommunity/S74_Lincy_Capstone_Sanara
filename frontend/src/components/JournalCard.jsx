import { Link } from "react-router-dom";
import api from "../services/api";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function JournalCard({ journal }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/journals/${journal._id}`);
      window.location.reload();
    } catch {
      alert("Failed to delete entry.");
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 flex justify-between items-start">
      
      {/* Content */}
      <div className="space-y-2">
        <span className="inline-block text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
          {journal.mood}
        </span>

        <h4 className="text-lg font-semibold">
          {journal.title}
        </h4>

        <p className="text-gray-600 text-sm">
          {journal.content.slice(0, 120)}...
        </p>

        <p className="text-xs text-gray-400">
          {new Date(journal.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          to={`/journal/${journal._id}`}
          className="text-gray-500 hover:text-[#4F6F5B]"
          title="View entry"
        >
          <Eye size={18} />
        </Link>

        <Link
          to={`/journal/edit/${journal._id}`}
          className="text-gray-500 hover:text-blue-600"
          title="Edit entry"
        >
          <Pencil size={18} />
        </Link>

        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-600"
          title="Delete entry"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
