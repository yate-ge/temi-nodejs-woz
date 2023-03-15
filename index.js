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

//等待五秒后，robot.speak("鸡你太美");
setTimeout((() => {
    robotAction2();
}), 3000);

// function robotAction() {
//     robot.speak("鸡你太美").then(robot.speak("练习时长两年半"));
//     //robot.speak("哥哥好棒");

// }


// 说完一句话后等待五秒再说另外一句话
async function robotAction2() {
    robot.speak('Hello')
        .then(() => {
            // 在这里编写需要等待 5 秒后执行的代码，例如说下一句话
            return robot.ask('你叫什么名字？');
        })
        .then((reply) => {
            console.debug('debug reply: ' + reply);
            if (reply.includes('叮当')) {
                return robot.speak('你好，叮当。我将带你去到你的座位');
            } else {
                await robot.speak('我不认识你，请你离开');
                return Promise.reject();
            }
        }).then(() => {
            return robot.speak('马上出发');
        }).catch(() => {
            return robot.speak('结束测试对话');
        });

}


function robotAction3() {
    robot.detectHuman().then(() => {
        robot.speak("有人来了");
    })
        .then(() => {
            return robot.ask("有什么可以帮到您？");
        })
        .then((reply) => {
            return robot.speak('好的，谢谢你。你说：'+ reply);
        });
}

function robotAction4() {
    robot.goto("kitchen").then(() => {
        robot.speak("我来了");
    });
}

// eventemitter.on("humanDetected", humanDetectedRobotBehavior);
// function humanDetectedRobotBehavior() {
//     robot.ask("有什么可以帮到您？");

// }


