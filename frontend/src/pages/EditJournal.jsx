import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import JournalForm from "../components/JournalForm";

export default function EditJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);

  useEffect(() => {
    api.get("/journals").then(res => {
      const found = res.data.find(j => j._id === id);
      setJournal(found);
    });
  }, [id]);

  const handleUpdate = async (data) => {
    await api.put(`/journals/${id}`, data);
    navigate("/dashboard");
  };

  if (!journal) return <p>Loading...</p>;

  return <JournalForm initialData={journal} onSubmit={handleUpdate} />;
}
