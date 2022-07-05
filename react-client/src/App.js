import 'App.css';
import {useState} from 'react';

export default function App() {
  const name = useState("Hello World");


  return (
    <div className="App">
      <h1>Web Sockets</h1>
      <div className="name">{name}</div>
    </div >
  );
}