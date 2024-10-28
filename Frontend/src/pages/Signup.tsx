import { Link, useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import { useState } from 'react';
import api from '../services/api';

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: ""
  });
  const [file, setFile] = useState({
    avatar: null,
    coverImage: null
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state to track loading status
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    setFile({
      ...file,
      [name]: files[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Reset error before submission
    setLoading(true); // Show loading status

    const formDataAppend = new FormData();
    //@ts-ignore
    formDataAppend.append('avatar', file.avatar);
    //@ts-ignore
    if (file.coverImage) formDataAppend.append('coverImage', file.coverImage);
    formDataAppend.append('email', formData.email);
    formDataAppend.append('username', formData.username);
    formDataAppend.append('password', formData.password);
    formDataAppend.append('fullName', formData.fullName);

    try {
      const res = await api.post('/user/register', formDataAppend);

      // If successful, navigate to login
      if (res.data) {
        navigate('/login');
      } else {
        throw new Error("Unknown error occurred during registration.");
      }
    } catch (error: any) {
      // Display specific error message from response or a generic one
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again later.");
      }
      console.error("Error during registration:", error);
    } finally {
      setLoading(false); // Hide loading status
    }
  };

  return (
  <div className='container'>

    <form className="signup-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your username"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Enter your fullname"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />
      <label>Avatar</label>
      <input type="file" onChange={handleFileChange} name="avatar" />

      <label>Cover Image</label>
      <input type="file" onChange={handleFileChange} name="coverImage" />

      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="Enter your email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        placeholder="Enter your password"
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <p>
        Already have an account? <Link to="/login">here</Link>
      </p>
    </form>
  </ div>
  );
}

export default Signup;
