import Robot from "../robotapi.js";
import vm from "vm";
import fs from "fs";

// 您需要执行的 index.js 代码
console.log('Hello from gpt2Temi.js!');


const robot = new Robot();
await robot.wait(3000);

// robot.display("https://www.figma.com/proto/6Bjbr5OUurNB7dhQr9vqo2/ROMAN2023?page-id=0%3A1&node-id=1-8&viewport=824%2C648%2C0.29&scaling=scale-down&hide-ui=1");




// 读取 userscript.js 的内容
const userScriptContent = fs.readFileSync('./GPT2Temi/userscript.js', 'utf8');


const sandbox = {
    robot: robot,
};

vm.createContext(sandbox);
vm.runInContext(userScriptContent, sandbox);