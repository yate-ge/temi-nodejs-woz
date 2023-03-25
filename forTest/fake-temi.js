
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


  // 自定义发送内容
  setTimeout(() => {
    humandetectedEvent();
  }, 5000);



  function humandetectedEvent() {
    const message = {
      event: 'humanDetected',
      state: '2',
      id: 'fakehumanDetectedEvent_id'
    };
    const jsonMessage = JSON.stringify(message);
    socket.send(jsonMessage);
    console.log('send message: ' + jsonMessage);
  }


  // 接收客户端发送的消息并返回
  socket.on('message', async (message) => {
    console.log(`Received message: ${message}`);


    // 解析该json string消息，返回id
    // parse the incoming message
    let json = null;
    try {
      json = JSON.parse(message);
      console.log("json.id: " + json.id);
    }
    catch (e) {
      console.log("无法解析json: " + message);
    }

    // handle the different commands
    switch (json.command) {
      case "speak":
        handleSpeak(json);
        break;
      case "ask":
        handleAsk(json);
        break;
      case "goto":
        handleGoto(json);
        break;
      case "wakeUp":
        handleWakeUp(json);
      default:
        console.log("unknown command: " + json.command);
    }

    

    function handleSpeak(json) {
      console.log("speak: " + json.sentence);
      setTimeout(() => {
        const msg = {
          id: json.id
        };
        socket.send(JSON.stringify(msg));
        console.log("send message: " + JSON.stringify(msg));
      }, ResponseDelay);
    }

    function handleAsk(json) {
      console.log("ask: " + json.sentence);
      setTimeout(() => {
        // reply with a random answer from "葛亚特"，“胡源达”，“绳子”
        const answers = ["葛亚特", "胡源达", "绳子"];
        const answer = answers[Math.floor(Math.random() * answers.length)];


        const msg = {
          id: json.id,
          reply: answer
        };
        socket.send(JSON.stringify(msg));
        console.log("send message: " + JSON.stringify(msg));
      }, ResponseDelay);
    }

    function handleGoto(json) {
      console.log("goto: " + json.location);
      setTimeout(() => {
        const msg = {
          id: json.id
        };
        socket.send(JSON.stringify(msg));
        console.log("send message: " + JSON.stringify(msg));
      }, ResponseDelay);
    }

    function handleWakeUp(json) {
      console.log("wakeUp");
      setTimeout(() => {
        const msg = {
          id: json.id
        };
        socket.send(JSON.stringify(msg));
      }, ResponseDelay);
    }


  });
});
