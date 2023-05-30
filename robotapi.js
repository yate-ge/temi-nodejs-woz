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
    display(url) {
        const message = {
            command: 'openURL',
            url,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
        console.log('send message: ' + jsonMessage);
    }

    speak(sentence) {
        const message = {
            command: 'speak',
            sentence,
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);
        console.log('send message: ' + jsonMessage);
        msg_id.speak = message.id;



        return new Promise((resolve, reject) => {
            eventemitter.on("speakEvent", () => {
                resolve();
            });           
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
        console.log('send message: ' + jsonMessage);
        msg_id.goto = message.id;

        return new Promise((resolve, reject) => {
            eventemitter.on("gotoEvent", () => {
                console.log("goto complete");
                resolve();
            });
            
            // setTimeout(() => {
            //     resolve("goto timeout");
            // }, 30000);
        })



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

    // wakeup() {
    //     const message = {
    //         command: 'wakeup',
    //         id: generateUUID()
    //     };
    //     const jsonMessage = JSON.stringify(message);
    //     ws.send(jsonMessage);
    // }

    userRequest(task) {
        //监听'wakeup'事件，在事件触发后，将promise的状态改为resolve，返回promise,值为用户输入内容。
        return new Promise((resolve, reject) => {
            eventemitter.on("wakeupEvent", (reply) => {
                this.reply = reply;
                if (this.reply == task) {
                    console.log("wakeup: " + this.reply);
                    resolve(this.reply);
                } else {
                    resolve("no wakeup")
                }

            });
        }
        );

    }
    customRequest() {
        return new Promise((resolve, reject) => {
            eventemitter.on("wakeupEvent", (reply) => {
                this.reply = reply;
                console.log("wakeup: " + this.reply);
                resolve(this.reply);
            });
        }
        );

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

    // detectHuman() {
    //     return new Promise((resolve, reject) => {
    //         eventemitter.on("humanDetected", () => {
    //             resolve();
    //         });
    //     });
    // }

    // 用bewithme接口实现，从而可以手动关闭检测模式
    detectHuman(duration) {
        const message = {
            command: 'beWithMe',
            id: generateUUID()
        };
        const jsonMessage = JSON.stringify(message);
        ws.send(jsonMessage);

        return new Promise((resolve) => {

            eventemitter.on("humanDetectedonBeWithMe", () => {
                this.stopMovement();
                resolve(true);
            });

            if (duration) {
                setTimeout(() => {
                    this.stopMovement();
                    resolve(false);
                }, duration*1000);
            }
        });
    }


    wait(duration) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, duration*1000);
        });
    }

    end() {
        console.log("end");
    }

}
