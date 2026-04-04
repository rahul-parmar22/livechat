// 📁 components/Chat.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from '../axios'; // 👈 apna custom axios instance
const socket = io('http://localhost:5000');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null); // null = group
  const username = localStorage.getItem('username');

  // ✅ Get all users
  useEffect(() => {
    axios.get('/auth/users').then(res => {
      const filtered = res.data.filter(u => u.username !== username);
      setUsers(filtered);
    });
  }, []);

  // ✅ Get messages based on active chat
  useEffect(() => {
    axios
      .get(`/messages${activeUser ? `?with=${activeUser}` : ''}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        console.log('Fetched messages:', res.data); // for debug
        setMessages(res.data);
      });
  }, [activeUser]);

  // ✅ Receive new messages via socket
  useEffect(() => {
    socket.on('receive-message', (msg) => {
      if (
        (!msg.receiver && !activeUser) || // group chat
        (msg.receiver === username && msg.sender === activeUser) || // received personal
        (msg.sender === username && msg.receiver === activeUser)     // sent personal
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('receive-message');
  }, [activeUser]);

  // ✅ Send message
  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        sender: username,
        content: message,
        receiver: activeUser, // null if group chat
      };
      socket.emit('send-message', msgData);
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar for user list */}
      <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Users</h3>
        <div onClick={() => setActiveUser(null)} style={{ cursor: 'pointer', fontWeight: !activeUser ? 'bold' : 'normal' }}>
          Group Chat
        </div>
        {users.map((u, idx) => (
          <div
            key={idx}
            onClick={() => setActiveUser(u.username)}
            style={{ cursor: 'pointer', fontWeight: activeUser === u.username ? 'bold' : 'normal' }}
          >
            {u.username}
          </div>
        ))}
      </div>

      {/* Main Chat Window */}
      <div style={{ flex: 1, padding: '10px' }}>
        <h2>{activeUser ? `Chat with ${activeUser}` : 'Group Chat'}</h2>
        <div
          style={{
            border: '1px solid #ccc',
            height: '300px',
            overflowY: 'scroll',
            padding: '10px',
            marginBottom: '10px',
          }}
        >      
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.sender}</strong>: {msg.content}
            </div>
          ))}
        </div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
