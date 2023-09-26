import Login from 'pages/Login';
import Chat from 'pages/Chat';
import {useState} from 'react';
import 'App.css';

export default function App() {
  const [user, setUser] = useState(null);

  // Perform some login process for the user
  const login = function(email, password) {
    setUser({email});
  };

  const logout = function() {
    setUser(null);
  };

  return (
    <div className="App">
      <h1>Web Sockets</h1>

      {!user && <Login login={login} />}

      {user && <Chat logout={logout} />}

    </div >
  );
}