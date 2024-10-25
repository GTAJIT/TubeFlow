import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from 'js-cookie';
import api from "../services/api";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password } = formData;

    try {
      const res = await api.post('/user/login', {
        username,
        email,
        password,
      });
      
      // Check the response for debugging
      console.log("API Response:", res);
      
      if (!res || !res.data || !res.data.accessToken) {
        setError("Unable to log in");
        return; // Exit the function if there's no token
      }

      // Store token if available
      localStorage.setItem('token', res.data.accessToken);
      Cookie.set('token', res.data.accessToken);

      console.log("Navigating to /dashboard");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;
