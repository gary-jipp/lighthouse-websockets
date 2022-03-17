# Web Sockets

[ ] What is WebSockets
[ ] WebSockets & http protocol
[ ] Why WebSockets
[ ] Express Server
[ ] jQuery Client / React Client
[ ] Server: Listen for connections
[ ] Client: Connect
[ ] Client & Server: handle socket events
[ ] Create some sample events
[ ] Broadcast vs Direct messages - socket.id

XMLHttpRequest  Ajax - Request / Response
Hacked Ajax for real time - long polling
Comet - open an AJAX call and leave open
- request stream is not closed
- response stream not closed
- de-facto real-time
- was a hack! Ajax was never intended for this!
- needed a real solution

2008 - started working on a real standard
2010 - Chrome 4 - real websockets
2011 - The WebSocket Protocol RFC6455

On top of the HTTP protocol.  
All the auth, security, same port
Upgraded HTTP connection

Libraries:
ws - barebones
μWebSockets - fast! also pretty barebones
socket.io - the jQuery of Websockets
 - written back when Comet was a thing
 - tries LP first. Upgrades to WS
 - super easy to use
 - looks  a lot like jQuery
 - features: auto-reconnect. custom events!
 - getting old, still hugely popular.
