import React, { useState } from 'react';
import axios from '../axios';  // your axios instance
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      navigate('/chat');  // change to /chat instead of /  aa khub jaruri chhe ama khali chat natu lakhyu 2 hour thai problem gotata...karn ke url bov dhyan aapine lakhva ke shu url hash etyare shu show karvu.. mention hatu ke "/"" hoy to login batavvu to aavya kartu login refresh thaine 
    } catch (err) {
      alert('Login failed: ' + (err.response?.data || 'Server error'));
    }
  };

  return (
    <form onSubmit={login}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
