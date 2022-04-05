let email;

$(function() {
  email = randomEmail(5);

  // Connect to Web Socket Server
  const socket = io();
  // This is the same thing, showing the default path
  // const socket = io("/", {path:"/socket.io"});
  // const socket = io("/");  // This also works

  $("#send").on('click', () => sendMessage(socket));
  $("#clear").on('click', () => $("#messages").empty());
  //------------------------------------------------------------

  // Just to make things look cleaner
  listenForSocketEvents(socket);
});

const listenForSocketEvents = function(socket) {

  // On Connect, send who we are to server
  socket.on('connect', event => {
    console.log("Connected!");
    socket.emit("id", email);
    $(".email").text(email);
  });

  // Listen for custom events
  socket.on('server', data => {
    const element = `<li class='server'>${data}</li>`;
    $("#messages").prepend(element);
  });

  socket.on('private', data => {
    const element = `<li class='private'>${data.from}: ${data.text}</li>`;
    $("#messages").prepend(element);
  });

  socket.on('public', data => {
    const element = `<li>${data}</li>`;
    $("#messages").prepend(element);
  });
};

// Generates a random email address
const randomEmail = function(size) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let string = chars[Math.floor(Math.random() * 26)];
  for (let i = 0; i < size - 1; i++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return (string + '@gmail.com');
};

// Send Message
const sendMessage = function(socket) {
  const text = $("#input").val();
  if (!text) {
    return;
  }

  // If to a specific user, send 'private' message
  const to = $("#to").val();
  if (to) {
    socket.emit("private", { to, text });
    return;
  }

  // Otherwise send 'public' message to all
  socket.emit("public", text);
};