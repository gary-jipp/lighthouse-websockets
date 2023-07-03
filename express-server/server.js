const {Server} = require('socket.io');
const express = require('express');

// Enable Cookie Sessions
const cookieSession = require('cookie-session');    // for Client Cookie Sessions
const session = cookieSession({name: 'session', keys: ["secret"], sameSite: true});

// Can also use Server-based sessions
// const expressSession = require("express-session");  // For Server Sessions
// const session = expressSession({
//   secret: "password",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {sameSite: true}
// });

// Create Express App
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(session);

// Login: save user to session
app.post("/api/login", (req, res) => {
  const name = req.body.email;
  const user = {id: 1, name};
  req.session.user = user;
  res.json(user);
});

// Just to avoid 404 errors
app.get("/favicon.ico", (req, res) => {
  console.log("ico");
  res.status(204).send("");
});

// Login: remove user object from session
app.post("/api/logout", (req, res) => {
  console.log("logout:", req.session.user);
  req.session = null;
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
  const name = session?.user?.name;

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
