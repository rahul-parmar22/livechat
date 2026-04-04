import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Chat from "./components/Chat.jsx";    //without css designed component of this web.... niche private routes ma chhe aa component, to tene uncomment karo e aa j chhe
import { Link } from "react-router-dom";
import ChatDesign from "./components/ChatDesign.jsx";

// Protected route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      {/* Navigation Links yahan Routes ke bahar rakho */}
      {/* <nav>
        <a href="/register">Register</a> | <a href="/login">Login</a>
      </nav> aa page ne reload kare(game e form submit karta tyare login,registration)...tethi nichenu link tag thi karvu....  */}
      {/* 🔥 Yeh 1 Chhoti Galti page refresh ka reason hai:

Yeh <a href="..."> tags browser ko hard refresh karne pe majboor karte hain — iska matlab hai React Router ke SPA navigation ko bypass kar dete hain, aur pura page reload hota hai. */}

      <div className="container">
        <nav>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </nav>
        {/* ✅ Link component React Router ke internal navigation system ko use karta hai — no page reload, no socket disconnect, no lost token. */}

        {/* You can even hide Register/Login nav links once user is logged in:
<nav>
  {!localStorage.getItem('token') ? (
    <>
      <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
    </>
  ) : (
    <Link to="/chat">Chat</Link>
  )}
</nav> */}

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/chat"
            element={
              <PrivateRoute>
                {/* <Chat />   without css designed file...if you wnat without design, so uncommnet it..*/}
                <ChatDesign />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;

// // backend/
//    ├─ config/
// // │   └─ db.js
// // ├─ controllers/
// // │   └─ authController.js
//    |   └─ messageController.js
//    ├─ middleware/
// // │   └─ authMiddleware.js
// // ├─ models/
// // │   └─ Message.js
//    |   └─ User.js
// // ├─ routes/
// // │   └─ auth.js
//    |   └─ messages.js
// // ├─ socket/
// // │   └─ index.js
// // |-- server.js

// // frontend/
// // └─ src/
// //     ├─ components/
// //     │   └─ Chat.jsx
//        ├─ pages/
// //     │   └─ Login.jsx
//        |   └─Register.jsx
// //     └─ App.jsx
//        └─ axios.js
