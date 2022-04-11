const express = require('express');
const { Server } = require('socket.io');
const app = express();

app.use(express.static("public"));

const http = app.listen(8080, () => {
  console.log(`Server running at http://localhost:8080`);
});


//------------------------ SOCKET.IO STUFF -----------------------------
// It would be best to put all this socket.io stuff in a separate module

const io = new Server(http);

// This is the same thing showing the Default path: "/socket.io"
// const io = new Server(http, {path:"/socket.io"});

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
io.on('connection', client => {
  console.log("Client Connected: ", client.id);

  // Listen for disconnect events from this client
  client.on('disconnect', () => {
    console.log("disconnected: ", client.id);
    removeUser(client.id);
  });

  // Listen for "id" events from this client
  client.on('id', email => {
    users[email] = client.id;
    console.log(users);
    io.to(client.id).emit("server", `Welcome ${email}`);
    io.emit("server", `${email} just connected`);
  });

  // Listen for "private" events from this client
  client.on('message', data => {
    const { to, text } = data;

    // We know the socket ID of the sender.  Lookup email for "from"
    const from = getEmailById(client.id);

    // If no "to" send a broadcast message to all 
    if (!to) {
      console.log(`public: from=${from}, text=${data.text}`);
      io.emit("public", { text, from });
      return;
    }

    //  We need the socket ID of the "to" user
    const id = users[to];
    if (id) {
      console.log(`private:  to=${data.to}, from=${from}, text=${data.text}`);
      io.to(id).emit("private", { text, from });   // Send to that id
    }

    // send() just sends a "message" event
    // socket.send("msg.text);
  });

  // Can also use a catch-all listener
  client.onAny((event, data) => {
    console.log(`Event: [${event}] ${JSON.stringify(data)}`);
  });

});