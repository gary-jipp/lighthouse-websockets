const email = randomEmail(3);

$(function() {
  $(".email").text(email);

  // Connect to Web Socket Server
  const socket = io();
  // This is the same thing, showing the default path
  // const socket = io("/", {path:"/socket.io"});
  // const socket = io("/");  // This also works

  $("#send").on('click', () => sendMessage(socket));
  $("#clear").on('click', () => $("#messages").empty());
  //------------------------------------------------------------

  // Just to make things cleaner
  socketEventHandler(socket);
});

const socketEventHandler = function(socket) {

  // On Connect, tell the server who we are
  socket.on('connect', event => {
    console.log("Connected!");
    socket.emit("id", email);

    // socket.send({ event:"id", email });
  });

  // Listen for custom events
  socket.on('server', data => {
    const element = `<li class='server'>${data}</li>`;
    $("#messages").prepend(element);
  });

  socket.on('private', data => {
    const { from, text } = data;

    const element = `<li class='private'>${from} says: ${text}</li>`;
    $("#messages").prepend(element);
  });

  socket.on('public', data => {
    const { from, text } = data;

    const element = `<li class='public'>${from} says: ${text}</li>`;
    $("#messages").prepend(element);
  });


  socket.onAny((event, data) => {
    console.log(`Event: [${event}] ${JSON.stringify(data)}`);
  });

};

// Send Message
const sendMessage = function(socket) {
  const text = $("#input").val();
  if (!text) {
    return;
  }

  // Send 'message' event
  const to = $("#to").val();
  socket.emit("message", { to, text });

  // send() is more like vanilla websockets. No custom event name
  // defaults to "message" event
  // socket.send({ to, text });
};

// Generates a random email address
function randomEmail(size) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let string = chars[Math.floor(Math.random() * 26)];
  for (let i = 0; i < size - 1; i++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return (string + '@gmail.com');
};