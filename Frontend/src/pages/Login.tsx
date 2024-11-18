import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from 'js-cookie';
import api from "../services/api";
import { userIdContext } from "../context/auth.atoms";
import { useSetRecoilState } from "recoil";
import '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUserId = useSetRecoilState(userIdContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password } = formData;
    try {
      setLoading(true)
      const res = await api.post('/user/login', { username, email, password });
      // Debugging API response
      console.log("API Response:", res);
      
      if (!res || !res.data || !res.data.accessToken) {
        setError("Unable to log in. No token received.");
        return; // Exit if no access token
      }

      // Store token if available
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      Cookie.set('token', res.data.accessToken);
      Cookie.set('refreshToken', res.data.refreshToken)
      // Update auth state
      setUserId(res.data.userId);
      localStorage.setItem('authUser', 'true');
      console.log("Auth state set to true. Navigating to /dashboard.");
      // Separate the navigation call for clarity
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please try again.");
    } finally{
      setLoading(false)
    }
  };

  return (
  <div className="container">

    <form className="login-container" onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        />
      <input
        type="email"
        name="email"
        placeholder="example@email.com"
        value={formData.email}
        onChange={handleChange}
        />
      <input
        type="password"
        name="password"
        placeholder="*********"
        value={formData.password}
        onChange={handleChange}
        />
      <button type="submit">{loading? "Logging In....": "Login"}</button>

      {error && <p>{error}</p>}
    </form>
</div>
  );
}

export default Login;
