import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewJournal from "./pages/NewJournal";
import EditJournal from "./pages/EditJournal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal/new" element={<NewJournal />} />
        <Route path="/journal/:id/edit" element={<EditJournal />} />
      </Routes>
    </BrowserRouter>
  );
}
