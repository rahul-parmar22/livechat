const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const socketHandler = require('./socket');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');




const app = express();
const server = http.createServer(app);    //Express app ke upar ek HTTP server create kiya.
                                          //Socket.IO ko HTTP server ke upar attach karna padta hai.
const { Server } = require('socket.io');  //Socket.IO ka Server class import kiya. Ye real-time connection handle karega.

const io = new Server(server, {           //👉 io = pura socket server (sab clients ka controller)..have aa aakhu websocket server bani gyu chhe io, 
  cors: {
    origin: 'http://localhost:5173', // your React frontend origin (Vite)
    methods: ['GET', 'POST']
  }
});

// Yahan Socket.IO server create kiya hai.

// server pass kiya hai jisse ye HTTP server ke sath attach ho jaye.

// cors set kiya hai taki React frontend se connection allow ho.

// Important::: Yehi line WebSocket ka main setup hai. Ye basically kehta hai:

// “Browser jo React app pe hai, usse WebSocket connection allow hai, aur sirf GET/POST methods ke liye.”
//aapane je browser nu server chhe evu ek websocket nu server banavyu and e server ne browser na server sathe attach karyu ane browser etale server je react app etale frontend sathe chhe te frontend sathe websocket have chale ane ahi cors chhe e aa mate chhe.....ane only get/post method j chalshe




// Connect to DB
connectDB();

// Middleware            

app.use(cors());  //cors() => frontend se requests allow karega.
app.use(express.json());   //express.json() => incoming request body ko JSON me parse karega.
 
// Routes
app.use('/auth', authRoutes);   //aaya authroutes and messageroutes uparthi import karelu chhe ..rya je name nakho te name ahi hoy and tya je file thi location lidhu te filena badha routes ni aagal have ahiya je lagavela chhe te lagi jay...
app.use('/messages', messageRoutes);

// Socket.IO
socketHandler(io);

// Yahan aapka Socket.IO logic call ho raha hai.

// io ko pass kiya gaya hai jisse connection, message send/receive, aur disconnect handle kar sake.

// Basically, real-time communication ka saara kaam ab './socket' file me hoga.



// Start Server
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
// HTTP server 5000 port pe start ho gaya.

// Ye line server ko listening mode me daalti hai, taaki React frontend aur WebSocket dono connect ho sake.


// backend/
// ├─ config/
// │   └─ db.js 
// ├─ controllers/
// │   └─ authController.js
// │   └─ messageController.js
// ├─ middleware/
// │   └─ authMiddleware.js
// ├─ models/
// │   └─ Message.js
// │   └─ User.js
// ├─ routes/
// │   └─ auth.js
// │   └─ messages.js
// ├─ socket/
// │   └─ index.js
// └─ server.js

// frontend/
// └─ src/
//     ├─ components/
//     │   └─ Chat.jsx
//     ├─ pages/
//     │   └─ Login.jsx
//     │   └─ Register.jsx
//     ├─ App.jsx
//     └─ axios.js





// 2️⃣ const app = express(); ka matlab
//Express app create kiya. Ye middleware aur routes ko handle karega.
// express() ek function call hai jo ek Express application object return karta hai.

// Iska naam humne app rakha (common convention).

// Ye object server ki functionalities ko encapsulate karta hai.
// app basically ek powerful object hai jo kaafi cheeze allow karta hai:
// | Feature      | Example                                 | Description                                                          |
// | ------------ | --------------------------------------- | -------------------------------------------------------------------- |
// | Routing      | `app.get("/home", (req, res) => {...})` | Different endpoints handle karna                                     |
// | Middleware   | `app.use(express.json())`               | Request process karne ke liye pipeline (logging, body parsing, auth) |
// | Config       | `app.set("port", 5000)`                 | App configuration set karna                                          |
// | Server start | `app.listen(5000, ()=>{})`              | Node HTTP server ke upar listen karna                                |
// | Static files | `app.use(express.static("public"))`     | HTML, CSS, JS serve karna                                            |




// 1. config/db.js
// MongoDB (ya kisi aur database) se connection ka configuration.

// Yahan Mongoose ka connect() function ho sakta hai.

// 2. controllers/
// Yahan logic hota hai routes ke liye.

// authController.js – Login, Register, JWT token generate karna.

// messageController.js – Messages save/send/fetch karne ka logic.

// 3. middleware/authMiddleware.js
// JWT ya session based authentication middleware.

// Protected routes ko access dene se pehle verify karta hai user.

// 4. models/
// Mongoose schemas (ya ORM models) define kiye jaate hain.

// User.js – User ka schema: username, email, password etc.

// Message.js – Message schema: sender, receiver, content, timestamp.

// 5. routes/
// API endpoints define hote hain.

// auth.js – /api/auth/login, /register etc.

// messages.js – /api/messages/send, /getMessages etc.

// 6. socket/index.js
// Real-time communication ke liye Socket.io ka implementation.

// Chat ke liye live send/receive messages ka logic.

// 7. server.js
// Express server ka entry point.

// Routes, middleware, DB connection aur socket server yahin se initialize hote hain.

// 💻 Frontend/src/
// 1. components/Chat.jsx
// Chat UI component.

// Messages display karna, typing input lena, send button wagairah.

// 2. pages/
// Individual pages for routing.

// Login.jsx – User login form.

// Register.jsx – User registration form.

// 3. App.jsx
// Main React component — routing aur layout handle karta hai.

// React Router ka use ho sakta hai.

// 4. axios.js
// Axios instance with baseURL, token handling (interceptors).

// API requests simplify karne ke liye custom confi