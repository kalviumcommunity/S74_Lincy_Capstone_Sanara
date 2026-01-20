import { Routes, Route } from "react-router-dom";

import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewJournal from "./pages/NewJournal";
import EditJournal from "./pages/EditJournal";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* App */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/journal/new" element={<NewJournal />} />
      <Route path="/journal/edit/:id" element={<EditJournal />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
