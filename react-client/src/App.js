import Login from 'pages/Login';
import Chat from 'pages/Chat';
import 'App.css';
import {useState} from 'react';

export default function App() {
  const [auth, setAuth] = useState(false);

  // Perform some login process for the user
  const login = function(email, password) {
    setAuth(true);
  };

  const logout = function() {
    setAuth(false);
  };

  return (
    <div className="App">
      <h1>Web Sockets React</h1>

      {auth && <Chat logout={logout} />}
      {!auth && <Login login={login} />}

    </div >
  );
}