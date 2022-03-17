
$(function() {
  console.log("Ready!");

  $("#clear").on('click', () => {
    $("#messages").empty();
  });

  $("#send").on('click', () => {
    const text = $("#input").val();
    if (!text) {
      return;
    }

    const to = $("#to").val();
    console.log("to=", to);

    if (!to) {  // Message was sent to no specific user
      socket.emit("public", text);
      return;
    }

    socket.emit("private", { to, text });
  });

  const socket = io();
  //------------------------------------------------------------
  socket.on('connect', event => {
    console.log("Connected!");
    const email = randomEmail(5);
    socket.emit("id", email);
    $(".email").text(email);
  });

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

});

// Generates a random email address
const randomEmail = function(size) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let string = chars[Math.floor(Math.random() * 26)];
  for (let i = 0; i < size - 1; i++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return (string + '@gmail.com');
};