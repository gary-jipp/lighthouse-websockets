const email = randomEmail(3);

$(function() {
  $(".email").text(email);
});

// Generates a random email address
function randomEmail(size) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let string = chars[Math.floor(Math.random() * 26)];
  for (let i = 0; i < size - 1; i++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return (string + '@gmail.com');
};