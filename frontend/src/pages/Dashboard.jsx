import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import InsightCard from "../components/InsightCard";
import JournalCard from "../components/JournalCard";

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/journals")
      .then((res) => setJournals(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FBFCFA] text-[#2F3E34]">
      
      {/* NAVBAR */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-10 py-6 flex items-center justify-between">
          
          {/* App Identity */}
          <div>
            <h1 className="text-2xl font-semibold">🌿 Sanara</h1>
            <p className="text-sm text-gray-500">
              Emotional patterns dashboard
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/journal/new"
              className="bg-[#4F6F5B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#405C4C]"
            >
              New Entry
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-10 py-10 space-y-12">

        {/* PAGE HEADER */}
        <section>
          <h2 className="text-2xl font-serif mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600 max-w-2xl">
            A summary of your recent emotional patterns and journal activity.
          </p>
        </section>

        {/* INSIGHTS */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">
            Insights Overview
          </h3>
          <InsightCard />
        </section>

        {/* JOURNAL ENTRIES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Journal Entries
            </h3>
            <span className="text-sm text-gray-500">
              {journals.length} total entries
            </span>
          </div>

          {journals.length === 0 ? (
            <div className="bg-white border rounded-lg p-6 text-gray-600">
              No journal entries yet. Start by creating your first entry.
            </div>
          ) : (
            <div className="space-y-4">
              {journals.map((journal) => (
                <JournalCard
                  key={journal._id}
                  journal={journal}
                />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
