import {  Routes, Route, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Channel from "./pages/Channel";
import Video from "./pages/Video";
import Navbar from "./components/Navbar";

function Page() {
  const location = useLocation()
  const isAuth = location.pathname == '/signup' || location.pathname =='/login' || location.pathname == '/'

  return (
    <>
    {!isAuth && <Navbar/>}
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
          <Route path="/video/:videoId" element={<Video/>}></Route>
        </Routes>
    </>
  );
}

export default Page;
