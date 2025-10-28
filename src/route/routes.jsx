import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/auth";

// Blocks access until we know auth status; sends guests to /login
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:20}}>Checking session…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Keeps logged-in users out of /login (optional nicety)
export function PublicOnlyRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:20}}>Loading…</div>;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
