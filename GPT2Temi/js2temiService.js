import Robot from "../robotapi.js";
import vm from "vm";
import fs from "fs";
import express from "express";  // 加载 express 包

const robot = new Robot();
await robot.wait(3);

const app = express();  // 创建一个 express 实例
app.use(express.json());  // 解析 JSON 格式的请求体

// 创建一个 POST 路由，用来接收前端的请求
app.post("/js2temi", (req, res) => {
    const userScriptContent = req.body.script;  // 从请求体中获取 JavaScript 代码

    // 将 JavaScript 代码写入 userscript.js 文件
    fs.writeFileSync('./GPT2Temi/userscript.js', userScriptContent, 'utf8');

    // 发送一个响应，表示操作成功
    res.json({ status: "success" });

    runUserScript();

});

// 启动 HTTP 服务器，监听 3000 端口
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});


function runUserScript() {
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
