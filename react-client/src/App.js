import 'App.css';
import { useEffect, useState } from 'react';
import io from "socket.io-client";

export default function App() {
  const [socket, setSocket] = useState("");
  const [email, setEmail] = useState();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [to, setTo] = useState("");

  const clear = function() {
    setMessages([]);
  };

  useEffect(() => {
    setEmail(randomEmail(5));
  }, []);

  // This app makes a websocket connection immediately
  useEffect(() => {
    // Connect to server
    const socket = io("/");
    setSocket(socket);

    socket.on('connect', event => {
      console.log("connected");
      socket.emit("id", email);
    });

    socket.on('public', msg => {
      setMessages(prev => [msg, ...prev]);
    });

    socket.on('private', msg => {
      setMessages(prev => [`${msg.from} says: ${msg.text}`, ...prev]);
    });

    // ensures we disconnect to avoid memory leaks
    return () => socket.disconnect();
  }, [email]);

  const onTextChange = function(event) {
    setText(event.target.value);
  };
  const onToChange = function(event) {
    setTo(event.target.value);
  };

  // Generates a random email address
  const randomEmail = function(size) {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = chars[Math.floor(Math.random() * 26)];
    for (let i = 0; i < size - 1; i++) {
      string += chars[Math.floor(Math.random() * chars.length)];
    }
    return (string + '@gmail.com');
  };

  // Send chat message to someone
  const send = function() {
    socket && text && socket.emit('private', { text, to });
  };

  const list = messages.map((msg, i) => {
    return <li key={i}>{msg}</li>;
  });

  return (
    <div className="App">
      <h1>Web Sockets React</h1>

      <div className="email">{email}</div>
      <div>
        <input onChange={onToChange} value={to} placeholder="Recipient" />
      </div>
      <div>
        <textarea onChange={onTextChange} placeholder="Type a message" />
      </div>

      <button onClick={send}>Send</button>
      <button onClick={clear}>Clear</button>
      <ul>
        {list}
      </ul>
    </div >
  );
}