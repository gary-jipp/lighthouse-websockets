import { useEffect, useState } from 'react';
import randomEmail from 'email';
import 'App.css';

export default function App() {
  const [email, setEmail] = useState();

  // This is our login email
  useEffect(() => {
    setEmail(randomEmail(3));
  }, []);

  return (
    <div className="App">
      <h1>Web Sockets React</h1>
      <div className="email">{email}</div>
    </div >
  );
}