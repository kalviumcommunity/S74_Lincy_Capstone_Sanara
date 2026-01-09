import { useEffect, useState } from "react";
import api from "../services/api";
import JournalList from "../components/JournalList";
import InsightCards from "../components/InsightCards";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    api.get("/journals").then(res => setJournals(res.data));
  }, []);

  return (
    <>
      <h2>Dashboard</h2>
      <Link to="/journal/new">New Entry</Link>
      <InsightCards journals={journals} />
      <JournalList journals={journals} />
    </>
  );
}
