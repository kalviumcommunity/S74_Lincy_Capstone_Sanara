import { useState } from "react";
import { login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Invalid email or password");
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
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Continue your reflection journey
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-900 transition"
            >
              Log In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
