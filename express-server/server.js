const express = require('express');
const {Server} = require('socket.io');
const ikea = require('ikea-name-generator');

const app = express();

const http = app.listen(8080, () => {
  console.log(`Server running at port: 8080`);
});


const clients = {};

const io = new Server(http);

io.on('connection', (client) => {
  const name = ikea.getName();
  console.log("Someone connected!", client.id, name);
  client.name = name;
  clients[name] = client.id;
  console.log(clients);


  client.broadcast.emit('server', `${name}: just connected`);

  // console.log(client);

  client.emit("name", name);

  client.on("message", data => {
    console.log("message:", data);
    data.from = client.name;

    if (data.to) {
      ///  send to specific user
      const id = clients[data.to];
      console.log("message is for: ", data.to, id);
      io.to(id).emit('user', data);
      return;
    }

    // Send to all
    client.broadcast.emit('user', data);
  });


  client.on('disconnect', () => {
    delete clients[client.name];
    console.log('Client Disconnected!', client.name);
  });

});
