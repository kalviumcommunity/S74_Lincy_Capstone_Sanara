import JournalForm from "../components/JournalForm";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NewJournal() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    await api.post("/journals", data);
    navigate("/dashboard");
  };

  return <JournalForm onSubmit={handleCreate} />;
}
