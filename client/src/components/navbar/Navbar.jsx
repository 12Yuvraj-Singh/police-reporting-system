import React from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide navbar on homepage
  const authPaths = ['/', '/login', '/admin-login', '/register', '/verify', '/forgot-password', '/reset-password'];
  if (authPaths.includes(location.pathname)) return null;

  return (
    <header className="fixed w-full z-40">
      <div className="flex items-center justify-between px-6 py-3 glass neon-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-blue-600 to-green-500 flex items-center justify-center text-white font-bold shadow-lg">
            IN
          </div>
          <div className="text-white font-semibold">Smart Policing Portal</div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-white hidden md:block">
                {user.name || user.phone || user.batchNo}
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-black px-3 py-1 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
