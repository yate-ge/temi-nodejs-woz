//const WebSocket = require('ws');

import WebSocket from 'ws';
import events from 'events';
import { stringify } from 'querystring';


export const eventemitter = new events.EventEmitter();
export const ws = new WebSocket('ws://localhost:8175');

// export let goto_id = 0;
// export let ask_id = 0;

export let msg_id = {
  goto: 0,
  ask: 0
}


ws.on('open', function() {
  const message = {
    command: 'speak',
    sentence: '连接成功',
    id: 'connect_id'
  };
  const jsonMessage = JSON.stringify(message);
  ws.send(jsonMessage);
});

ws.on('message', function(data) {
  console.log('Received message: ' + data);

  //尝试解析json
  let json = {};
  try {
    json = JSON.parse(data);

    //
    //判断是否是事件
    if (json.event&&json.state == "2") {
      //触发事件
      eventemitter.emit("humanDetected");
    }

   
// 处理 askQuestion的用户回复
    if (json.reply && json.id == msg_id.ask) {
      console.log("触发reply事件");
      eventemitter.emit("replyEvent", json.reply);
    }

    if (json.id == msg_id.goto) {
      console.log("触发goto完成事件");
      eventemitter.emit("gotoEvent", json.state);
    }

  } catch (e) {
    //console.log("无法解析json: " + data);
  }



  






});

ws.on('close', function() {
  console.log('Connection closed.');
});



//export ws;
//export { eventemitter, goto_id, ask_id };