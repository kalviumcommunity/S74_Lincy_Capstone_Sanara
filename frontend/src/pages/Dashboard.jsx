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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this entry?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/journals/${id}`);
      setEntries((prev) => prev.filter((j) => j._id !== id));
      setDrafts((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#2F3E35]">
      {/* HEADER */}
      <header className="bg-[#F6F3EE] border-b border-[#E5DED5]">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium tracking-wide">Sanara</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/journal/new"
              className="bg-[#5F7F6B] hover:bg-[#4F6F5B] text-white px-5 py-2 rounded-full text-sm transition"
            >
              New entry
            </Link>

            <Link
              to="/profile"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E5DED5] text-[#5F7F6B] hover:bg-white transition"
              title="Profile"
            >
              <User size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-8 py-12 space-y-16">
        {/* INTRO */}
        <section className="max-w-3xl">
          <h2 className="text-3xl font-serif mb-3">
            Your recent reflections
          </h2>
          <p className="text-sm text-[#7B877E] leading-relaxed">
            This space gently mirrors your thoughts and emotions over time.
            There’s nothing to fix here — only patterns to notice.
          </p>
        </section>

        {/* INSIGHTS */}
        <section className="space-y-5">
          <h3 className="text-lg font-medium">
            Emotional overview
          </h3>
          <InsightCard />
        </section>

        {/* DRAFTS */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              In progress
            </h3>
            <span className="text-sm text-[#8A948D]">
              {drafts.length}
            </span>
          </div>

          {drafts.length === 0 ? (
            <div className="bg-white border border-[#E5DED5] rounded-2xl p-6 text-sm text-[#8A948D]">
              You don’t have any unfinished thoughts right now.
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((journal) => (
                <JournalCard
                  key={journal._id}
                  journal={journal}
                  isDraft
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* ENTRIES */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Past entries
            </h3>
            <span className="text-sm text-[#8A948D]">
              {entries.length}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="bg-white border border-[#E5DED5] rounded-2xl p-6 text-sm text-[#8A948D]">
              Your completed reflections will appear here over time.
            </div>
          ) : (
            <div className="space-y-5">
              {entries.map((journal) => (
                <JournalCard
                  key={journal._id}
                  journal={journal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
