import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 border-b bg-white">
      <Link to="/dashboard" className="text-xl font-semibold text-green-700">
        Sanara
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/profile">Profile</Link>
        <button
          onClick={logout}
          className="text-red-600 font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
