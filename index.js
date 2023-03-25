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


greetUser();

async function greetUser() {
    await robot.detectHuman();
    const currentTime = new Date().getHours();
    let greeting;
    if (currentTime >= 5 && currentTime < 12) {
      greeting = "Good morning";
    } else if (currentTime >= 12 && currentTime < 17) {
      greeting = "Good afternoon";
    } else {
      greeting = "What's up";
    }
    await robot.speak(greeting);
}



