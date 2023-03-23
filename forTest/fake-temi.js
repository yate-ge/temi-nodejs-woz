
import { WebSocket, WebSocketServer } from "ws";



// create a new WebSocket server
const server = new WebSocketServer({ port: 8175 });
const ResponseDelay = 3000;

// log when server is ready
server.on('listening', () => {
  console.log('Server is listening on port 8175');
});

server.on('connection', (socket) => {
  console.log('New client connected');
  
  // 发送消息给客户端
  socket.send('Welcome to the server!');

  // 接收客户端发送的消息并返回
  socket.on('message', async (message) => {
    console.log(`Received message: ${message}`);


    // 解析该json string消息，返回id
    let json = {};
    try {
      json = JSON.parse(message);
      console.log("json.id: " + json.id);
    }
    catch (e) {
      console.log("无法解析json: " + message);
    }

    switch (json.command) {
      case "speak":
        console.log("speak: " + json.sentence);
        setTimeout(() => {
          msg = {
            id: json.id
          };
          socket.send(JSON.stringify(msg));
        }, ResponseDelay);
        break;
      case "ask":
        console.log("ask: " + json.sentence);
        setTimeout(() => {
          msg = {
            id: json.id,
            reply: "hello"
          };
          socket.send(JSON.stringify(msg));
        }, ResponseDelay);
        break;
      case "goto":
        console.log("goto: " + json.location);
        setTimeout(() => {
          msg = {
            id: json.id
          };
          socket.send(JSON.stringify(msg));
        }, ResponseDelay);
        break;
      default:
        console.log("unknown command: " + json.command);
    }



    // // 将id包装成json string消息，发送给客户端
    // const reply = {
    //   id: json.id
    // };
    // const jsonReply = JSON.stringify(reply);
    
    // // 等待五秒后，再发送消息给客户端
    // setTimeout(() => {
    //   socket.send(jsonReply);
    // }, 5000);

    //返回该消息
    socket.send(message);

  });
});
