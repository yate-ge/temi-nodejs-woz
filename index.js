//const socket = require('./ws.js');

import Robot from "./robotapi.js";
import {
    eventemitter
} from './ws.js';



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







await Promise.all([
    robot.speak("正在前往葛亚特的座位"),
    robot.goto("葛亚特的座位")
])
await robot.speak("已到达");



