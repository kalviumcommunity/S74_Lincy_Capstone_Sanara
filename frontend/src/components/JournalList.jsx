import { Link } from "react-router-dom";
import api from "../services/api";

export default function JournalList({ journals }) {
  const handleDelete = async (id) => {
    await api.delete(`/journals/${id}`);
    window.location.reload();
  };

  return (
    <ul>
      {journals.map(j => (
        <li key={j._id}>
          <strong>{j.title}</strong> ({j.mood})
          <Link to={`/journal/${j._id}/edit`}>Edit</Link>
          <button onClick={() => handleDelete(j._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
