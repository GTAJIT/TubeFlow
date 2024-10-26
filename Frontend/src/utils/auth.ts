import { useRecoilValue } from "recoil";
import { authState } from "../context/auth.atoms";

// Replace this with your actual authentication check
const isAuthenticated = () => {
  const token = localStorage.getItem("token") !== null;
  const authUser = useRecoilValue(authState)
  if(!token) return false 
  if(!authUser) return false

  return true
};

export default isAuthenticated