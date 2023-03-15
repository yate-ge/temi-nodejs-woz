import WebSocket from "ws";
import ws, { eventemitter } from './ws.js';
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
        ws.ask_id = message.id;
        ws.send(jsonMessage);
        

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


    

}
