import 'App.css';
import {useState} from 'react';

export default function App() {
  const text = useState("Hello World");


  return (
    <div className="App">
      <h1>Web Sockets</h1>
      <div className="name">{text}</div>
    </div >
  );
}