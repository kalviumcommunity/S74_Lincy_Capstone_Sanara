import { useEffect, useState } from "react";
import { login } from "../services/auth";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // EMAIL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch {
      alert("Invalid email or password");
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
      document.getElementById("google-login-btn"),
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
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-[32px] border border-[#E5DED5] p-10 shadow-sm">
          <h1 className="text-3xl font-serif text-[#2F3E35] text-center mb-3">
            Welcome back
          </h1>

          <p className="text-center text-sm text-[#7B877E] mb-8 leading-relaxed">
            Take a quiet moment. Your journal is right where you left it.
          </p>

          {/* GOOGLE LOGIN */}
          <div id="google-login-btn" className="mb-8 flex justify-center" />

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#E3E0DA]" />
            <span className="text-xs text-[#8A948D] uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-[#E3E0DA]" />
          </div>

          {/* EMAIL LOGIN */}
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl bg-[#F6F3EE] border border-[#E3E0DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C8A78]"
            />

            <button
              type="submit"
              className="w-full mt-4 bg-[#5F7F6B] hover:bg-[#4F6F5B] text-white py-3 rounded-full text-sm tracking-wide transition"
            >
              Enter your space
            </button>
          </form>

          <p className="text-center text-sm text-[#6F7C74] mt-10">
            New here?{" "}
            <Link
              to="/signup"
              className="text-[#5F7F6B] font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
