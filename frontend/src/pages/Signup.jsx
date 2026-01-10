import { useState } from "react";
import { signup } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ email, password });
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f6] flex flex-col">
      {/* Header */}
      <div className="p-6 text-xl font-semibold text-green-800 flex items-center gap-2">
        🌿 <span>Sanara</span>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-1">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Begin your journey of self-reflection
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-900 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-green-800 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
