// 📁 components/Chat.jsx
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client"; //use→ real-time chatting ke liye server se connection
import axios from "../axios";   //→ backend se HTTP request bhejne ke liye
import "./ChatDesign.css";

const socket = io("http://localhost:5000");      //👉 Socket server se connection bana  → backend localhost:5000 pe chal raha hai.... ⚠️ Ye component ke bahar hai taaki baar-baar connection na bane..component reder ho to ye bar bar na chale isaliye..

function ChatDesign() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [unreadUsers, setUnreadUsers] = useState(new Set());//👉 Yahan initial value Set object hai...🔹 Set kya hota hai?.Set JavaScript ka data structure hai jo:❌ Duplicate values allow nahi karta and ✅ Har value unique hoti hai...ex..const s = new Set();  s.add(1);  s.add(1);  s.add(2);   console.log(s); // Set {1, 2}.......
  //const [groupUnread, setGroupUnread] = useState(false);           //🔹 Is case mein kyun Set?..Unread users ke case mein:Ek user ko ek hi baar unread mark karna hota hai..Duplicate user IDs nahi chahiye..Isliye Set best choice hai ✅

  const username = localStorage.getItem("username");
  const messagesEndRef = useRef(null);

  useEffect(() => {       //🔹 Auto scroll effect
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {  //🔹 Users list fetch karna
    axios.get("/auth/users").then((res) => {
      const filtered = res.data.filter((u) => u.username !== username);
      setUsers(filtered);
    });
  }, []);

  useEffect(() => {      //🔹 Messages fetch karna (group / personal)         
    axios
      .get(`/messages${activeUser ? `?with=${activeUser}` : ""}`, {   //👉Group chat → /messages   👉Personal chat → /messages?with=username
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  }, [activeUser]);

  useEffect(() => {   //🔹 Socket listener (real-time message)
    socket.on("receive-message", (msg) => {   //socket.on 👉 Server se message aaya  //  aani andarnu kyare chalshe jo socket thi kai pan message aavashe to 
      if (
        (!msg.receiver && !activeUser) || // group chat  //👉 Group message + tum group chat pe ho
        (msg.receiver === username && msg.sender === activeUser) || // receiving from active personal chat  //👉 Active personal chat se message receive hua..jeni hare vat karta hov tyathi koi message aavyo em 
        (msg.sender === username && msg.receiver === activeUser) // sending to active chat  //👉 Tumne jo message bheja wahi chat open hai
      ) {  // aa uparna tran no matlab chhe ke jo active user no hoy to means group chat ane jo receiver username hoy means aapane hovi  ane sender active user etale je usernu aapane chat open karelu chhe e..ke pachhi jo sender aapane hovi and receiver active user to pan same ke aapane jene mokalvi e enu chat open chhe to nicheni line run karo setMessage ni..means setmessages ma already .get thi message ma message set hashe pan je have new message aavyo tene pan tema prev ma add kari dyo em  
        setMessages((prev) => [...prev, msg]);
      } else { //⚠️ Unread message logic          //else means uparni tran condition means current ma user open no karelo hoy je active user cheh e aapane jeni hare var karvi chhi e no hoy to  ane if (msg.receiver === username) aa thay means user aapanane message mokle chhe karan reveiver ma aapane chhhie..to aavu thay ke msg aave ane aapane uparni condtion ma hovi aapane to receiver to aapane chhie pan aapane chat active user koik bijani kholi chhe to aa message aavyo have e unread ma jashe em 
        // ⚠️ Message from someone not currently chatting with
         if (msg.receiver === username) {       //👉 Message kisi aur user se aaya
          setUnreadUsers((prev) => new Set(prev).add(msg.sender));
        }                                             
      }
    });



//     ✅ Server side (correct way)   // ahi upar code ma wrong practice chhe...server bahda user ne badha message send kare chhe ane te badhamathi aapane filter karine show karie chhie je unnecessary sapce roke ane priveacy pan leak thavana chances chhe to wrong chhe aa
// socket.on("join-room", (room) => {
//   socket.join(room);
// });

// socket.on("send-message", async (msg) => {
//   const saved = await Message.create(msg);

//   const room = [msg.sender, msg.receiver].sort().join("_");

//   io.to(room).emit("receive-message", saved);
// });
// ✅ Client side
// useEffect(() => {
//   if (activeUser) {
//     const room = [username, activeUser].sort().join("_");
//     socket.emit("join-room", room);
//   }
// }, [activeUser]);

    return () => socket.off("receive-message");  //👉 Cleanup → duplicate listeners se bachne ke liye
  }, [activeUser]);

  const sendMessage = () => {
    if (message.trim()) {         //👉 Empty message nahi bhejna
      const msgData = {       //👉 Message ka data object
        sender: username,
        content: message,
        receiver: activeUser,
        // ❌ removed timestamp
      };
      socket.emit("send-message", msgData);   //socket.emit👉 Server ko message bheja
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {  
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="current-user">
          👤 <strong>Logged in as:</strong> {username}
        </div>

        <h3>Users</h3>
        <div
          onClick={() => {
            setActiveUser(null); // Group chat ke liye activeUser null hona chahiye
            setUnreadUsers((prev) => {
              const copy = new Set(prev);
              // Group chat me unreadUsers ka koi matlab nahi hai, par agar chahiye to clear kar sakte ho
              return copy;
            });
          }}
          className={`user ${!activeUser ? "active" : ""}`}
        >
          Group Chat
        </div>

        {users.map((u, idx) => (
          <div
            key={idx}
            onClick={() => {
              setActiveUser(u.username);
              setUnreadUsers((prev) => {
                const copy = new Set(prev);
                copy.delete(u.username);
                return copy;
              });
            }}
            className={`user ${activeUser === u.username ? "active" : ""}`}
          >
            {u.username}
            {unreadUsers.has(u.username) && <span className="unread-dot" />}   {/* unread userma jo aa usernu name hoy to j aa span ma je  chhe e batavo em ..atyare span ma green dot chhe to e batavo em..*/}
          </div> 
        ))}
      </div>

      <div className="chat-main">
        <div className="chat-header">
          {activeUser ? `Chat with ${activeUser}` : "Group Chat"}
        </div>
        <div className="messages">
          {messages.map((msg, idx) => {
            const isOwn = msg.sender === username;
            return (
              <div key={idx} className={`message ${isOwn ? "own" : "other"}`}>
                {!isOwn && (
                  <div className="avatar">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="message-content">
                  <strong>{msg.sender}</strong>
                  <p>{msg.content}</p>
                  {msg.timestamp && (
                    <div className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />

        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatDesign;

// for(let i=0; i<4; i++){
//     for(let col=0; col<=i; col++){
//     let string = "*"
//     console.log(string)
//     }
// }