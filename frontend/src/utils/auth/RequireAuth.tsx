import useAuth from "./useAuth";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode; }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}