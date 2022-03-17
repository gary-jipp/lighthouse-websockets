const express = require('express');
const socketio = require('socket.io');
const app = express();

app.use(express.static("public"));

const http = app.listen(8080, () => {
  console.log(`Server running at http://localhost:8080`);
});


//------------------------ SOCKET.IO STUFF -----------------------------
// It would be best to put all this socket.io stuff in a separate module
const ioServer = socketio(http);

// Our database of client.id's with email as key
const users = {};

const getEmailById = function(id) {
  for (const email in users) {
    if (users[email] == id) {
      return email;
    }
  }
};

const removeUser = function(id) {
  const email = getEmailById(id);
  if (email)
    delete users[email];
};

// Listen for "connection" events
ioServer.on('connection', client => {
  console.log("Client Connected: ", client.id);

  // Listen for disconnect events from this client
  client.on('disconnect', () => {
    console.log("disconnected: ", client.id);
    removeUser(client.id);
  });

  // Listen for "message" events from this client
  client.on('message', data => {
    console.log(data);
  });

  // Listen for "id" events from this client
  client.on('id', email => {
    console.log("ID: ", email);
    users[email] = client.id;
    console.log(users);
    ioServer.to(client.id).emit("server", `Welcome ${email}`);
    ioServer.emit("public", `connected: ${email}`);
  });

  // Listen for "public" events from this client
  client.on('public', data => {
    console.log("public: ", data);
    ioServer.emit("public", data);
  });

  // Listen for "private" events from this client
  client.on('private', data => {
    const { to, text } = data;
    const id = users[to];
    const from = getEmailById(client.id);
    console.log(`private:  to=${data.to}, from=${from}, text=${data.text}`);

    // Only send if there is a client.id 
    if (id) {
      ioServer.to(id).emit("private", { text, from });   // Send to that id
    }
  });

});