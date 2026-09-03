import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";

import Home from "./pages/Home";
import Untangle from "./pages/Untangle";
import Threads from "./pages/Threads";
import SituationDetail from "./pages/SituationDetail";
import RealityCheck from "./pages/RealityCheck";
import DecisionRoom from "./pages/DecisionRoom";
import MyMap from "./pages/MyMap";
import Resolved from "./pages/Resolved";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Sanara 2.0 Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/untangle"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Untangle />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/threads"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Threads />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/threads/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SituationDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/threads/:id/reality-check"
          element={
            <ProtectedRoute>
              <AppLayout>
                <RealityCheck />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/threads/:id/decision"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DecisionRoom />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyMap />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resolved"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Resolved />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Privacy />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
