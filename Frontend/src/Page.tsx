import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Channel from "./pages/Channel";
import { useEffect } from "react";
import { authState } from "./context/auth.atoms";

function Page() {
  const setAuthUser = useSetRecoilState(authState);

  useEffect(() => {
    const fetchAuthUser = async ()=> {
    const isAuthenticated = await localStorage.getItem("authUser") === "true";
    setAuthUser(isAuthenticated);
    console.log("App - authUser set from localStorage:", isAuthenticated);
    }
    fetchAuthUser()
  }, [setAuthUser]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/channel"
            element={
              <ProtectedRoute>
                <Channel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Page;
