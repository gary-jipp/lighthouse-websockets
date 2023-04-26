import {useEffect, useState} from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import sound from 'sounds/notify.mp3';

const Chat = function(props) {
  const [play] = useSound(sound, {volume: 0.75});
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [text, setText] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('connect', () => {
      // console.log("Connected.");
    });

    socket.on("system", data => {
      // console.log(data);
      setMessages(prev => [data, ...prev]);
    });

    socket.on("public", data => {
      const message = `${data.from} says:  ${data.text}`;
      setMessages(prev => [message, ...prev]);
      // console.log(data);
    });

    socket.on("private", data => {
      notify();
      const message = `${data.from} says:  ${data.text}`;
      setMessages(prev => [message, ...prev]);
      // console.log(data);
    });

    return () => socket.disconnect(); // prevents memory leaks
  }, []);

  const notify = function() {
    play();
  };;

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
