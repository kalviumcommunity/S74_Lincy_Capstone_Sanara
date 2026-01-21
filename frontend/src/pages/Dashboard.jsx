import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import api from "../services/api";
import InsightCard from "../components/InsightCard";
import JournalCard from "../components/JournalCard";

export default function Dashboard() {
  const [drafts, setDrafts] = useState([]);
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/journals")
      .then((res) => {
        setDrafts(res.data.drafts || []);
        setEntries(res.data.entries || []);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  const entryCount = entries.length;

  // 🧨 DELETE DRAFT
  const handleDeleteDraft = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this draft? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/journals/${id}`);
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Failed to delete draft", err);
    }
  };

  // ▶️ RESUME DRAFT
  const handleResumeDraft = (id) => {
    navigate(`/journal/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#2F3E35]">
      {/* HEADER */}
      <header className="border-b border-[#E5DED5]">
        <div className="max-w-5xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-xl font-medium">Sanara</h1>

          <div className="flex items-center gap-4">
            <Link
              to="/journal/new"
              className="bg-[#5F7F6B] text-white px-6 py-2 rounded-full text-sm hover:bg-[#4F6F5B]"
            >
              Add today’s reflection
            </Link>

            <Link
              to="/profile"
              className="w-10 h-10 rounded-full border border-[#E5DED5] flex items-center justify-center"
            >
              <User size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-8 py-14 space-y-16">
        {/* HERO / EMPTY STATE */}
        {entryCount < 3 ? (
          <section className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-serif">
              We’re still learning your patterns
            </h2>
            <p className="text-sm text-[#7B877E]">
              Add {3 - entryCount} more reflections to unlock your first insight.
            </p>

            <div className="w-full h-2 bg-[#E5DED5] rounded-full">
              <div
                className="h-full bg-[#5F7F6B]"
                style={{ width: `${(entryCount / 3) * 100}%` }}
              />
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif">
                What’s affecting you lately
              </h2>
              <p className="text-sm text-[#7B877E]">
                Based on your last {entryCount} reflections
              </p>
            </div>

            <InsightCard />
          </section>
        )}

        {/* 📝 DRAFTS */}
        {drafts.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-sm uppercase tracking-wide text-[#7B877E]">
              Drafts ({drafts.length})
            </h3>

            <div className="space-y-3">
              {drafts.map((journal) => (
                <JournalCard
                  key={journal._id}
                  journal={journal}
                  isDraft
                  onResume={() => handleResumeDraft(journal._id)}
                  onDelete={() => handleDeleteDraft(journal._id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 📚 PAST ENTRIES (READ ONLY) */}
        {entries.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm uppercase tracking-wide text-[#7B877E]">
                Past reflections
              </h3>

              <Link
                to="/history"
                className="text-sm text-[#7B877E] hover:text-[#2F3E35]"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {entries.slice(0, 3).map((journal) => (
                <JournalCard
                  key={journal._id}
                  journal={journal}
                  readOnly
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
