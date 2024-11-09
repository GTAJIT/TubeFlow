import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  // const refreshToken = localStorage.getItem("refreshToken"); // Assuming you store the refresh token as well
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // console.log(refreshToken)
    if (!token) {
      setIsAuthenticated(false); // No token or refresh token means not authenticated
      return;
    }

    // First, check if the access token is valid
    api.get("/user/check", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);

        // If the access token is valid, we don't need to refresh it
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.log("Access token expired or invalid:", err);

        // If the access token is invalid or expired, try to refresh it using the refresh token
        api
          .post(
            "/user/refresh-access-token")
          .then((response) => {
            console.log("Access token refreshed:", response.data);
            // If refresh is successful, set authenticated state
            setIsAuthenticated(true);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
          })
          .catch(() => {
            // If refresh fails, set isAuthenticated to false and redirect to login
            setIsAuthenticated(false);
          });
      });
  }, [token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading indicator while checking
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
