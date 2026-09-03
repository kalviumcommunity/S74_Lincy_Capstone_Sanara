import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, ShieldCheck } from "lucide-react";
import SkyBackground from "../components/SkyBackground";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-5 sm:p-8 relative selection:bg-sky-100 selection:text-sky-900">
      <SkyBackground />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="sky-card overflow-hidden shadow-2xl border-sky-100/80 bg-white">
          {/* Header */}
          <div className="px-8 pt-8 pb-7 text-center space-y-1.5 border-b border-sky-100 bg-gradient-to-b from-sky-50/60 to-white">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-800">
              SANARA
            </h1>
            <p className="eyebrow-xs text-sky-700 tracking-widest text-[10px]">
              PERSONAL SITUATION INTELLIGENCE
            </p>
            <p className="font-serif italic text-sm text-slate-600 pt-1">
              "Create your private thinking space."
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl text-xs bg-red-50 text-red-700 border border-red-200"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your preferred name"
                  className="input-sky"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="input-sky"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-600" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input-sky pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-sky-primary w-full justify-center py-3.5 mt-3 group"
              >
                <span>{loading ? "Creating your space..." : "Create my space"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 text-center text-xs border-t border-sky-100 bg-sky-50/40 text-slate-600 flex items-center justify-between">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-semibold text-sky-700 hover:text-sky-900 hover:underline inline-flex items-center gap-1"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-sky-600" />
        <span>Your thoughts are private by default</span>
      </div>
    </div>
  );
}
