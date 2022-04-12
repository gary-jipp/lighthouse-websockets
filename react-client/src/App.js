import { useEffect, useState } from 'react';
import randomEmail from 'email';
import io from "socket.io-client";
import 'App.css';

export default function App() {
  const [socket, setSocket] = useState();
  const [email, setEmail] = useState();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    setEmail(randomEmail(3));
  }, []);

  useEffect(() => {
    // Connect to server
    const socket = io("/");

    socket.on('connect', event => {
      console.log("connected");
      socket.emit("id", email);
    });

    socket.on('server', msg => {
      setMessages(prev => [msg, ...prev]);
    });

    socket.on('public', msg => {
      setMessages(prev => [`${msg.from} says: ${msg.text}`, ...prev]);
    });

    socket.on('private', msg => {
      setMessages(prev => [`${msg.from} says: ${msg.text}`, ...prev]);
    });

    setSocket(socket);
    return () => socket.disconnect(); // prevents memory leak!
  }, [email]);

  // Send chat message to someone
  const send = function() {
    socket && text && socket.emit('message', { text, to });
  };

  const list = messages.map((msg, i) => {
    return <li key={i}>{msg}</li>;
  });

  return (
    <div className="App">
      <h1>Web Sockets React</h1>
      <div className="email">{email}</div>

      <div>
        <input
          onChange={event => setTo(event.target.value)}
          value={to}
          placeholder="Recipient" />
      </div>
      <div>
        <textarea
          onChange={event => setText(event.target.value)}
          placeholder="Type a message" />
      </div>

      <button onClick={send}>Send</button>
      <button onClick={() => setMessages([])}>Clear</button>

      <ul>
        {list}
      </ul>

    </div >
  );
}