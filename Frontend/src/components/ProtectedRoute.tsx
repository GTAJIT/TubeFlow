import { Navigate } from "react-router-dom";

// Replace this with your actual authentication check
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
