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
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F3E34] flex flex-col">
      
      {/* Top Brand */}
      <div className="px-10 py-6 text-xl font-semibold">
        🌿 Sanara
      </div>

      {/* Center Card */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-3xl border border-[#E6EFEA] shadow-sm p-10">
          
          <h2 className="text-2xl font-serif text-center mb-2">
            Welcome back
          </h2>
          <p className="text-center text-[#7A8A80] mb-8">
            Continue your reflection journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full px-4 py-3 rounded-xl border border-[#C9B8A6]
                  bg-[#FAF7F2] placeholder:text-[#7A8A80]
                  focus:outline-none focus:ring-2 focus:ring-[#4F6F5B]
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full px-4 py-3 rounded-xl border border-[#C9B8A6]
                  bg-[#FAF7F2] placeholder:text-[#7A8A80]
                  focus:outline-none focus:ring-2 focus:ring-[#4F6F5B]
                "
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full bg-[#4F6F5B] text-white py-3 rounded-full
                font-medium hover:opacity-90 transition
              "
            >
              Log in
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-[#7A8A80] mt-8">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#4F6F5B] font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
