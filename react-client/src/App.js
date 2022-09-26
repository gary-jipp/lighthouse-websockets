import Chat from 'Chat';
import 'App.css';
import {useState} from 'react';

export default function App() {
  const [auth, setAuth] = useState(true);

  return (
    <div className="App">
      <h1>Web Sockets React</h1>
      {auth && <Chat />}
    </div >
  );
}