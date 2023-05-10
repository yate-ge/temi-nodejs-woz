//const WebSocket = require('ws');

import WebSocket from 'ws';
import events from 'events';
import { stringify } from 'querystring';


export const eventemitter = new events.EventEmitter();
export const ws = new WebSocket('ws://192.168.123.10:8175');

// export let goto_id = 0;
// export let ask_id = 0;

export let msg_id = {
  goto: 0,
  ask: 0,
  speak:0
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

    // 处理speak 结束的回调
    if (json.id == msg_id.speak) {
      console.log("触发speak完成事件");
      eventemitter.emit("speakEvent");
    }
    

// 处理 askQuestion的用户回复
    if (json.reply && json.id == msg_id.ask) {
      console.log("触发reply事件");
      eventemitter.emit("replyEvent", json.reply);
    }
    // 处理用户唤醒temi时的输入，由于返回的结果都是用户返回的内容，如果是askquestion回复的话，会有对应的id。所以如果id不匹配的话，可以认为是 temi唤醒时用户的输入。
    if (json.reply && json.id != msg_id.ask) {
      console.log("触发wakeup事件");
      eventemitter.emit("wakeupEvent", json.reply);
    }

    if (json.id == msg_id.goto) {
      console.log("触发goto完成事件");
      eventemitter.emit("gotoEvent", json.state);
    }

    if (json.event == "onBeWithMeStatusChanged" && json.status == "track") {
      console.log("触发onBeWithMeStatusChanged事件,找到目标");
      eventemitter.emit("humanDetectedonBeWithMe", json.status);
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