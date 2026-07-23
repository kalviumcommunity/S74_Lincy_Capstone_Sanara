import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin, login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // EMAIL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setError("");
    setLoading(true);
    try {
      if (!response?.credential) {
        throw new Error("Missing Google credential");
      }

      await googleLogin(response.credential);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Google authentication failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex flex-col">
      {/* Brand */}
      <header className="px-10 py-6 text-lg font-medium text-[#3F4F46] tracking-wide">
        <Link to="/" className="hover:opacity-80 transition">
          Sanara
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-[32px] border border-[#E5DED5] p-8 md:p-10 shadow-sm">
          <h1 className="text-3xl font-serif text-[#2F3E35] text-center mb-3">
            Welcome back
          </h1>

          <p className="text-center text-sm text-[#7B877E] mb-6 leading-relaxed">
            Take a quiet moment. Your journal is right where you left it.
          </p>

          {/* INLINE ERROR ALERT */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FDF2F2] border border-[#F87171]/20 flex items-start gap-3 text-red-700 text-sm animate-fadeIn">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* GOOGLE LOGIN */}
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign-In was cancelled or failed")}
              theme="outline"
              size="large"
              width={320}
              shape="pill"
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#E3E0DA]" />
            <span className="text-xs text-[#8A948D] uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-[#E3E0DA]" />
          </div>

          {/* EMAIL LOGIN */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-5 py-3 rounded-2xl bg-[#F6F3EE] border border-[#E3E0DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C8A78] disabled:opacity-60 transition"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-5 py-3 pr-12 rounded-2xl bg-[#F6F3EE] border border-[#E3E0DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C8A78] disabled:opacity-60 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A948D] hover:text-[#2F3E35] transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#5F7F6B] hover:bg-[#4F6F5B] active:bg-[#3F5F4B] text-white py-3 rounded-full text-sm font-medium tracking-wide transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                "Enter your space"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#6F7C74] mt-8">
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
