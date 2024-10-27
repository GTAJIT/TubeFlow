import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  // console.log("Yo",typeof(token))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  useEffect(()=>{
    if (!token) {
      setIsAuthenticated(false); // No token means not authenticated
      return;
    }
      api.get('/user/check',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response)=>{
        console.log(response.data)
        setIsAuthenticated(true)
      })
      .catch(()=>{
        setIsAuthenticated(false)
      })
      
  }, [])
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading indicator while checking
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
