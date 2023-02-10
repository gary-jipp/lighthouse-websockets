import {useState} from 'react';
import axios from 'axios';
import Login from 'pages/Login';
import Chat from 'pages/Chat';
import 'App.css';

export default function App() {
  const [user, setUser] = useState(null);

  // Login user on the server
  const login = function(email, password) {
    axios.post("api/login", {email, password})
      .then(res => {
        setUser(res.data);
      });
  };

  const logout = function() {
    console.log("logout");
    axios.post("api/logout", {})
      .then(() => {
        setUser(null);
      });
  };

  return (
    <div className="App">
      <h1>Web Sockets React</h1>

      {user &&
        <>
          <span>Logged in as:</span><span className="name"> {user.name}</span>
          <button className="logout" type="button" onClick={logout}>Logout</button>
          <Chat />
        </>
      }

      {!user &&
        <Login login={login} />
      }

    </div >
  );
}