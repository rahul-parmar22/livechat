// const Message = require('../models/Message');

// function socketHandler(io) {
//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('send-message', async (msg) => {
//       const saved = await Message.create(msg);
//       io.emit('receive-message', saved); // broadcast to all clients
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// }

// module.exports = socketHandler;



const Message = require('../models/Message');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('send-message', async (msg) => {
      // Don't override timestamp here, mongoose will set default Date.now
      const saved = await Message.create(msg);
      io.emit('receive-message', saved); // broadcast saved message with timestamp as Date  //Server har connected user ko message bhej deta hai....Chahe wo us chat ka part ho ya nahi ❌ // personal chatting mate aa io.emit nahi vaparvu...100 user connected hoy to 100 user ne aa message mali jay to mate ...to peresonal chat mate rooms use karo ...room two-way hoy ..bemathi game e Jo bhi message bhejega → dono ko milega 
    });

    socket.on('disconnect', () => {        //Jab user browser close kare.....Ya internet chala jaye.....Socket disconnect ho jata hai
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = socketHandler;





// for group notification 

// Step 1: Group chat ke unread message ke liye ek boolean state add karo
// js
// Copy
// Edit
// const [groupUnread, setGroupUnread] = useState(false);
// Step 2: Jab naya message aaye aur group chat active na ho (activeUser == null), tab groupUnread ko true karo
// js
// Copy
// Edit
// socket.on("receive-message", (msg) => {
//   if (
//     (!msg.receiver && !activeUser) || // group chat active hai
//     (msg.receiver === username && msg.sender === activeUser) ||
//     (msg.sender === username && msg.receiver === activeUser)
//   ) {
//     setMessages((prev) => [...prev, msg]);

//     if (!msg.receiver && !activeUser) {
//       // Group chat message aur group chat open hai, so clear groupUnread
//       setGroupUnread(false);
//     }
//   } else {
//     if (msg.receiver === username) {
//       setUnreadUsers((prev) => new Set(prev).add(msg.sender));
//     } else if (!msg.receiver && activeUser !== null) {
//       // Group chat message par tum personal chat me ho (activeUser != null)
//       setGroupUnread(true);
//     }
//   }
// });
// Step 3: Jab group chat pe click karo, to unread clear kar do
// jsx
// Copy
// Edit
// <div
//   onClick={() => {
//     setActiveUser(null); // Group chat activate
//     setGroupUnread(false); // Group unread clear kar do
//     setUnreadUsers((prev) => {
//       const copy = new Set(prev);
//       return copy;
//     });
//   }}
//   className={`user ${!activeUser ? "active" : ""}`}
// >
//   Group Chat
//   {groupUnread && <span className="unread-dot" />}
// </div>
