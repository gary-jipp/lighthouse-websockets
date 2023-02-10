import {useState} from 'react';
import axios from 'axios';
import Login from 'pages/Login';
import Chat from 'pages/Chat';
import 'App.css';

export default function App() {
  const [user, setUser] = useState(null);

  // Perform some login process for the user
  const login = function(email, password) {
    axios.post("api/login", {email, password})
      .then(res => {
        setUser(res.data);
        console.log(res.data);
      });
  };

  const logout = function() {
    console.log("logout");
    axios.post("api/logout", {})
      .then(res => {
        setUser(null);
      })
      .catch(err => {
        console.log("Error: ", err.message);
      });
  };

  return (
    <div className="App">
      <h1>Web Sockets React</h1>

      {user && <Chat logout={logout} />}
      {!user && <Login login={login} />}

    </div >
  );
}