import { useAuth } from "@/context/AuthProvider";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type RequireAuthProps = {
  children: ReactNode;
};

function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useAuth();
  if (!user || Object.keys(user).length === 0) {
    return <Navigate to="/login" />;
  }
  return children;
}
export default RequireAuth;
