import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUserContext from "../contexts/UserContext";

interface ProtectedRouteProps {
  children?: ReactElement;
}

const ProtectedRoute = ({
  children,
}: ProtectedRouteProps): ReactElement | null => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />; // If children exist, render them; otherwise, render nested routes
};

export default ProtectedRoute;
