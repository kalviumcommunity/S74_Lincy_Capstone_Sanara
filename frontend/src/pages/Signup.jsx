import { useEffect, useState } from "react";
import { signup } from "../services/auth";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // EMAIL SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ email, password });
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  // GOOGLE AUTH
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await api.post("/auth/google", {
            credential: response.credential,
          });

          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
        } catch {
          alert("Google authentication failed");
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signup-btn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex flex-col">
      {/* Brand */}
      <header className="px-10 py-6 text-lg font-medium text-[#3F4F46] tracking-wide">
        Sanara
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-[32px] border border-[#E5DED5] p-10 shadow-sm">
          <h1 className="text-3xl font-serif text-[#2F3E35] text-center mb-3">
            Create your space
          </h1>

          <p className="text-center text-sm text-[#7B877E] mb-8 leading-relaxed">
            A quiet place to reflect, write, and understand yourself better.
          </p>

          {/* GOOGLE SIGNUP */}
          <div id="google-signup-btn" className="mb-3 flex justify-center" />
          <p className="text-xs text-center text-[#8A948D] mb-8">
            Signing up with Google sets up your account instantly
          </p>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#E3E0DA]" />
            <span className="text-xs text-[#8A948D] uppercase tracking-wider">
              or sign up with email
            </span>
            <div className="flex-1 h-px bg-[#E3E0DA]" />
          </div>

          {/* EMAIL SIGNUP */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl bg-[#F6F3EE] border border-[#E3E0DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C8A78]"
            />

            <input
              type="password"
              placeholder="Password (minimum 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-5 py-3 rounded-2xl bg-[#F6F3EE] border border-[#E3E0DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C8A78]"
            />

            <button
              type="submit"
              className="w-full mt-4 bg-[#5F7F6B] hover:bg-[#4F6F5B] text-white py-3 rounded-full text-sm tracking-wide transition"
            >
              Begin journaling
            </button>
          </form>

          <p className="text-center text-sm text-[#6F7C74] mt-10">
            Already have a space?{" "}
            <Link
              to="/login"
              className="text-[#5F7F6B] font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
