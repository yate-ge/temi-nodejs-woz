//const socket = require('./ws.js');

import Robot from "./robotapi.js";
import {
    eventemitter
} from './ws.js';

// const speak = (sentence) => {
//     const message = {
//         command: 'speak',
//         sentence,
//         id: '0'
//     };
//     const jsonMessage = JSON.stringify(message);
//     socket.send(jsonMessage);
// }

// const speakButton = document.getElementById('speak-button');


//等待五秒后，speak("鸡你太美");
// setTimeout(() => {
//     speak("鸡你太美");
// }
//     , 5000);

const robot = new Robot();

// //等待五秒后，robot.speak("鸡你太美");
// setTimeout((() => {
//     robotAction();
// }), 3000);


await robot.wait(3000);
// await Promise.all([
//     robot.speak("正在前往胡源达的座位"),
//     robot.goto("胡源达的座位")
// ])


    



let reply = await robot.ask("你叫什么名字？");
console.log("reply: " + reply);
await robot.speak("你好，" + reply);
