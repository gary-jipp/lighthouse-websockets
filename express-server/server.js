const {Server} = require('socket.io');
const express = require('express');
const ikea = require('ikea-name-generator');
const app = express();

app.get("/login", (req, res) => {
  res.json({"status": ok});
});

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});

const clients = {};
const io = new Server(http);

io.on('connection', client => {
  const name = ikea.getName();
  console.log("Client Connected!", name, " : ", client.id);
  client.emit("system", "Welcome");

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
