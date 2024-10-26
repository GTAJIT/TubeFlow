import { Navigate } from "react-router-dom";
import isAuthenticated from "../utils/auth";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
