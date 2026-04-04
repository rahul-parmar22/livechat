// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;


//TWO types of URL

// | Type                            | Example                        | Handle Kaun Karta Hai     | Purpose                  |
// | ------------------------------- | ------------------------------ | ------------------------- | ------------------------ |
// | **Frontend Route (React)**      | `/chat`, `/login`, `/register` | React Router (browser me) | Page dikhana / UI change |
// | **Backend API Route (Express)** | `/auth/users`, `/messages`     | Node.js + Express         | Data fetch / send        |

// ➡️ Frontend routes sirf page badalte hain.
// ➡️ Backend routes data dete hain (via Axios or Fetch).

// 💡 7. Remember — Ek Line Formula

// Frontend ka URL = page dekhne ke liye hota hai
// Backend ka URL = data lane / bhejne ke liye hota hai

// React page → Axios → Backend API → Database → Response → UI update ✅