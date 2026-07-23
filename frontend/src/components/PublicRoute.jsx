import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

export default function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
