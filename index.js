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

await robot.wait(1);



await robot.userRequest("导航任务");
await robot.speak("开始执行导航任务");
const target = await robot.ask("请问您要去哪里？");
if (target == "客厅") {
  await robot.goto("客厅");
  await robot.speak("已到达客厅");
}




