import Robot from "../robotapi.js";
import vm from "vm";
import fs from "fs";
import express from "express";  // 加载 express 包

const robot = new Robot();
await robot.wait(3);



export default function runUserScript() {
    // 读取 userscript.js 的内容
    const userScriptContent = fs.readFileSync('./GPT2Temi/userscript.js', 'utf8');

    const sandbox = {
        robot: robot,
        console: console, // 可以在用户脚本中使用 console.log
    };

    vm.createContext(sandbox);

    const wrappedContent = `(async () => { ${userScriptContent} })()`;
    vm.runInContext(wrappedContent, sandbox).catch((err) => {
        console.error('An error occurred while running the user script:', err);
    });
}
