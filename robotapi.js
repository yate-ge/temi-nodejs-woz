import WebSocket from "ws";
import {ws, eventemitter, msg_id } from './ws.js';
import generateUUID from "./generateUUID.js";
//import { eventemitter } from './ws.js';


// 导出一个Robot类，初始化的时候通过websockect 连接到```ws://192.168.123.10:8175```
export default class Robot {
    constructor() {
        this.reply = "no reply";

    

    }

    //let reply = "no reply";

    speak(sentence) {
        const message = {
            command: 'speak',
            sentence,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
        console.log('send message: ' + jsonMessage);



        // 按照文本长度决定等待时间
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, sentence.length*300);
        });



    }

    ask(sentence) {
        const message = {
            command: 'ask',
            sentence,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        msg_id.ask = message.id;
        console.debug("ask_id: " + msg_id.ask);
        ws.send(jsonMessage);
        console.log('send message: ' + jsonMessage);
        

        return new Promise((resolve, reject) => {
            this.reply = "no reply";

            eventemitter.on("replyEvent", (reply) => {
                this.reply = reply;
                console.log("replyEvent: " + reply);
                resolve(this.reply);
            });
            
            setTimeout(() => {
                resolve(this.reply);
            }, 10000);
        });
    }

    // 该方法将输入的sentence通过weboskcet发送到机器人，通过promise等待机器人的回复，然后将机器人回复的文本返回
    async ask2(sentence) {
        const message = {
            command: 'ask',
            sentence,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.ask_id = message.id;
        ws.send(jsonMessage);
        console.log('send message: ' + jsonMessage);

        // promise = new Promise((resolve, reject) => {
        //     eventemitter.on("replyEvent", (reply) => {
        //         console.log("replyEvent: " + reply);
        //         resolve(reply);
        //     });
        // });
        let reply = "no reply";
        // 通过eventemitter监听replyEvent事件，当事件触发时，将机器人回复的文本赋值给reply
        eventemitter.on("replyEvent", (reply) => {
            console.log("replyEvent: " + reply);
            reply = reply;
        });
        // 等待10秒，如果10秒内没有收到机器人的回复，就返回reply
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });
        return reply;
    }



    goto(location) {
        const message = {
            command: 'goto',
            location,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }

    tilt(angle) {
        const message = {
            command: 'tilt',
            angle,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }

    turn(angle) {
        const message = {
            command: 'turn',
            angle,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }
    

    stopMovement() {
        const message = {
            command: 'stopMovement',
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }


    savaLocation(location) {
        const message = {
            command: 'savaLocation',
            location,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }

    deleteLocation(location) {
        const message = {
            command: 'deleteLocation',
            location,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }





    call(userId) {
        const message = {
            command: 'call',
            userId,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }

    wakeup() {
        const message = {
            command: 'wakeup',
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }

    setDetectionMode(on) {
        const message = {
            command: 'setDetectionMode',
            on,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }

    checkDetectionMode() {
        const message = {
            command: 'checkDetectionMode',
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
    }

    detectHuman() {
        return new Promise((resolve, reject) => {
            eventemitter.on("humanDetected", () => {
                resolve();
            });
        });
    }


    wait(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }

}
