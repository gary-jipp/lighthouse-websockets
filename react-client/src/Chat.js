import {useEffect, useState} from 'react';
import io from 'socket.io-client';

const Chat = function() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [text, setText] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      console.log("Connected.");
    });

    socket.on("system", data => {
      setMessages(prev => [data, ...prev]);
      // console.log(data);
    });

    socket.on("public", data => {
      const message = `${data.from} says:  ${data.text}`;
      setMessages(prev => [message, ...prev]);
      // console.log(data);
    });

    socket.on("private", data => {
      const message = `${data.from} says:  ${data.text}`;
      setMessages(prev => [message, ...prev]);
      // console.log(data);
    });

    return () => socket.disconnect(); // prevents memory leaks
  }, []);


  const send = function() {
    socket.emit("message", {text, to});
  };

  const list = messages.map((msg, i) => {
    return <li key={i}>{msg}</li>;
  });

  return (
    <>
      <div>
        <input
          onChange={event => setTo(event.target.value)}
          value={to}
          placeholder="Recipient" />
      </div>

      <div>
        <textarea
          onChange={e => setText(e.target.value)}
          placeholder="Type a message" />
      </div>

      <button onClick={send}>Send</button>
      <button onClick={() => setMessages([])}>Clear</button>
      <ul>
        {list}
      </ul>
    </>
  );
};

export default Chat;