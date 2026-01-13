import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ✅ DELETE HANDLER (works for drafts + entries)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this journal?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/journals/${id}`);

      // remove from BOTH lists safely
      setEntries((prev) => prev.filter((j) => j._id !== id));
      setDrafts((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F3E34]">
      {/* NAVBAR */}
      <header className="bg-white border-b border-[#E6EFEA]">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">🌿 Sanara</h1>
            <p className="text-sm text-[#7A8A80]">
              Your space for reflection and patterns
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/journal/new"
              className="bg-[#4F6F5B] text-white px-5 py-2 rounded-full text-sm hover:opacity-90"
            >
              New entry
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-[#7A8A80] hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-8 py-10 space-y-14">
        {/* INTRO */}
        <section>
          <h2 className="text-2xl font-serif mb-2">Welcome back</h2>
          <p className="text-[#7A8A80] max-w-2xl">
            This is a snapshot of how you’ve been feeling recently.
            Nothing here tells you what to do — it simply reflects
            what you’ve recorded.
          </p>
        </section>

        {/* INSIGHTS */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Emotional overview</h3>
          <InsightCard />
        </section>

        {/* DRAFTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Drafts</h3>
            <span className="text-sm text-[#7A8A80]">{drafts.length}</span>
          </div>

          {drafts.length === 0 ? (
            <div className="bg-white border border-[#E6EFEA] rounded-2xl p-6 text-sm text-[#7A8A80]">
              No drafts right now.
            </div>
          ) : (
            <div className="space-y-3">
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
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Journal entries</h3>
            <span className="text-sm text-[#7A8A80]">{entries.length}</span>
          </div>

          {entries.length === 0 ? (
            <div className="bg-white border border-[#E6EFEA] rounded-2xl p-6 text-sm text-[#7A8A80]">
              You haven’t saved any completed entries yet.
            </div>
          ) : (
            <div className="space-y-4">
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
