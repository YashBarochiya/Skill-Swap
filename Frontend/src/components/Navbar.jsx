import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-indigo-400 transition">
          SkillSwap
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              <Link to="/" className="hover:text-indigo-400 transition">Dashboard</Link>
              <Link to="/profile" className="hover:text-indigo-400 transition">Profile</Link>
              <Link to="/skills" className="hover:text-indigo-400 transition">Skills</Link>
              <Link to="/messages" className="hover:text-indigo-400 transition">Messages</Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
              <Link
                to="/signup"
                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-2">
          {user ? (
            <>
              <Link to="/" className="block py-2 hover:text-indigo-400 transition">Dashboard</Link>
              <Link to="/profile" className="block py-2 hover:text-indigo-400 transition">Profile</Link>
              <Link to="/skills" className="block py-2 hover:text-indigo-400 transition">Skills</Link>
              <Link to="/messages" className="block py-2 hover:text-indigo-400 transition">Messages</Link>
              <button
                onClick={logout}
                className="w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:text-indigo-400 transition">Login</Link>
              <Link
                to="/signup"
                className="block py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg px-4 py-2 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
