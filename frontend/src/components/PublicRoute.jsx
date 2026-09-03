import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-sanara-primary flex items-center justify-center text-xs text-sanara-muted animate-pulse">
        Checking session...
      </div>
    );
  }

  if (user || localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
