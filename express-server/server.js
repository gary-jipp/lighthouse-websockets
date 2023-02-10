const {Server} = require('socket.io');
const express = require('express');
// const session = require("express-session");  // For Server Sessions
const session = require('cookie-session');    // for Client Cookie Sessions

const app = express();
app.use(express.static("public"));
app.use(express.json());

// Enable Cookie Sessions
const cookieSession = session({
  name: 'session',
  keys: ["secret"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});

// Can also use Server-based sessions
// const serverSession = session({
//   secret: "password",
//   resave: false,
//   saveUninitialized: false,
// });

app.use(cookieSession);

app.post("/api/login", (req, res) => {
  const name = req.body.email;
  req.session.name = name;
  res.json({name});
});

app.post("/api/logout", (req, res) => {
  console.log("logout");
  req.session.name = null;
  res.status(204).send();
});

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});

// Start WS Server
const io = new Server(http);
const clients = {};

// Allow socket.io to access session
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(session));

io.on('connection', client => {
  const session = client.request.session;
  const name = session.name;

  console.log("Client Connected!", name, " : ", client.id);
  client.emit("system", `Welcome ${name}`);
  client.broadcast.emit('system', `${name} has just joined`);

  // Add this client.id to our clients lookup object
  clients[name] = client.id;
  console.log(clients);

  client.on('message', data => {
    console.log(data);
    const {text, to} = data;
    const from = name;

    if (!to) {
      client.broadcast.emit('public', {text, from});
      return;
    }

    const id = clients[to];
    console.log(`Sending message to ${to}:${id}`);
    io.to(id).emit("private", {text, from});
  });

  client.on("disconnect", () => {
    console.log("Client Disconnected", name, " : ", client.id);
    client.broadcast.emit('system', `${name} has just left`);
    delete clients[name];
  });
});
