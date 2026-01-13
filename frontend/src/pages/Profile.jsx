import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Lock } from "lucide-react";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ entries: 0, drafts: 0 });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });

    api
      .get("/journals")
      .then((res) => {
        setStats({
          entries: res.data.entries.length,
          drafts: res.data.drafts.length,
        });
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChangePassword = async () => {
  try {
    const res = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });

    alert(res.data.message);
    setCurrentPassword("");
    setNewPassword("");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Failed to update password");
  }
};

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#7A8A80]">
        Loading profile…
      </div>
    );
  }

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F3E34]">
      {/* HEADER */}
      <header className="bg-white border-b border-[#E6EFEA]">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-2xl font-semibold">🌿 Sanara</h1>
            <p className="text-sm text-[#7A8A80]">
              Your space for reflection and patterns
            </p>
          </div>

          {/* RIGHT — PROFILE AVATAR ONLY */}
          <div className="w-10 h-10 rounded-full bg-[#E6EFEA] flex items-center justify-center text-[#4F6F5B] font-semibold">
            {initial}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        {/* ACCOUNT INFO */}
        <div className="bg-white border border-[#E6EFEA] rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Account</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-[#7A8A80]">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-[#7A8A80]">Joined</p>
              <p className="font-medium">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="bg-white border border-[#E6EFEA] rounded-2xl p-6 grid grid-cols-2 text-center">
          <div>
            <p className="text-2xl font-semibold">{stats.entries}</p>
            <p className="text-sm text-[#7A8A80]">Entries</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.drafts}</p>
            <p className="text-sm text-[#7A8A80]">Drafts</p>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-white border border-[#E6EFEA] rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Lock size={16} /> Change password
          </h2>

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-[#E6EFEA] rounded-lg px-4 py-2"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-[#E6EFEA] rounded-lg px-4 py-2"
          />

          <button
            onClick={handleChangePassword}
            className="bg-[#4F6F5B] text-white px-5 py-2 rounded-full text-sm hover:opacity-90"
          >
            Update password
          </button>
        </div>

        {/* LOGOUT */}
        <div className="bg-white border border-[#E6EFEA] rounded-2xl p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
