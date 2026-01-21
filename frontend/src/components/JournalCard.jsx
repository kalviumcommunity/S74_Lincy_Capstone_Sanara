import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function JournalCard({
  journal,
  isDraft = false,
  onDelete,
}) {
  return (
    <div className="bg-white border border-[#E6EFEA] rounded-2xl p-5 flex justify-between gap-6 hover:shadow-sm transition">
      {/* LEFT */}
      <div className="flex-1 space-y-2">
        {/* DRAFT BADGE */}
        {isDraft && (
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
            Draft · Incomplete
          </span>
        )}

        {/* MOOD ONLY FOR ENTRIES */}
        {!isDraft && (
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#E6EFEA] text-[#2F3E34]">
            {journal.mood}
          </span>
        )}

        <h4 className="text-lg font-semibold leading-snug">
          {journal.title || "Untitled reflection"}
        </h4>

        {/* META ONLY FOR ENTRIES */}
        {!isDraft && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#7A8A80]">
            {journal.energy && <span>⚡ Energy {journal.energy}/3</span>}
            {journal.context && <span>📁 {journal.context}</span>}
          </div>
        )}

        <p className="text-sm text-[#7A8A80] line-clamp-2">
          {journal.content}
        </p>

        {/* TAGS ONLY FOR ENTRIES */}
        {!isDraft && journal.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {journal.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#FAF7F2] border border-[#E6EFEA] px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end justify-between text-sm text-[#7A8A80]">
        <span>
          {new Date(journal.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-3">
          {/* VIEW (entries only) */}
          {!isDraft && (
            <Link
              to={`/journal/${journal._id}`}
              title="View"
              className="hover:text-[#4F6F5B]"
            >
              <Eye size={18} />
            </Link>
          )}

          {/* EDIT (drafts only) */}
          {isDraft && (
            <Link
              to={`/journal/edit/${journal._id}`}
              title="Continue draft"
              className="hover:text-[#4F6F5B]"
            >
              <Pencil size={18} />
            </Link>
          )}

          {/* DELETE (both) */}
          <button
            type="button"
            title="Delete"
            onClick={() => onDelete(journal._id)}
            className="hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
