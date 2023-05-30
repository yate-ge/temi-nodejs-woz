

//初始化temi
import Robot from "./robotapi.js";
const robot = new Robot();
await robot.wait(1);

// 初始化openai
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);


// 初始化工作记忆
let workingMemory = [];
let working = false;


const test = await interactWithGPT("你好");
console.log("test: " + test);

const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "this is a test" }],
    temperature: 0,
  });
console.log(completion.data.choices[0].message);
  

  
while (true) {
    console.log("等待用户请求...");

    // 等待用户输入请求
    const task = await robot.customRequest();
    console.log("收到用户请求:" + task);
    working = true;

    
    workingMemory.length = 0;
    workingMemory.push({ type: 'user request', content: task });
    
    while (working) {
        console.log("等待下一步行动...");
        const prompt = 
            `你是一个办公室的社交服务机器人，你将处理用户的服务请求，你将试图理解用户的服务需求，并根据用户的服务需求、长期记忆和当前的工作记忆（用户回复、人员检测结果、当期已经采用的机器人行动）来决定下一步行动，直到完成当前的用户请求，结束本次任务。

            你可以执行的的机器人行动的API函数：
                - robot.speak(sentence) ： 机器人说出一句话
                - robot.ask(sentence) ： 询问用户问题，返回用户的回答
                - robot.goto(location) ： 前往目标地点
                - robot.detectHuman() : 进行前方人员的检测，返回true或false
                - robot.end() ： 完成当前的用户请求，结束本次任务

            机器人长期记忆：
            - location: "小明的座位", "小绿的座位", "小白的座位", "客厅", "充电桩"
            - user:"小明", "小绿", "小白" 
            - Relation: "小明的座位"是"小明"的座位, "小绿的座位"是"小绿"的座位, "小白的座位"是"小白"的座位, "客厅"是"小绿"的座位, "充电桩"是"小白"的座位

            当前的工作记忆：
            ${workingMemory.map((item) => `- ${item.type}: ${item.content}`).join('\n')}


            下一步行动是什么？请你按照以下步骤进行思考：
            1.用户的请求内容是什么？对应我的任务目标是什么,为完成该目标，我需要完成哪些行动？
            2.根据用户的请求内容和当前的工作记忆，我还需要什么信息和行动来完成任务？
            3.我将根据以上的思考确定下一步的行动，然后执行它。

            请直接输出可执行的单个机器人行动函数:`;
        
        // 思考下一步行动
        const action = await interactWithGPT(prompt);
        console.log("收到gpt结果:" + action);
        const actionType = action.split('(')[0];
        switch (actionType) {
            case 'robot.speak':
                const sentence = action.split('"')[1];
                workingMemory.push({ type: 'robot action', content: "robot.speak(" + sentence + ")" });
                await robot.speak(sentence);
                break;
            case 'robot.ask':
                const question = action.split('"')[1];
                workingMemory.push({ type: 'robot action', content: "robot.ask(" + question + ")" });
                const answer = await robot.ask(question);
                workingMemory.push({ type: 'user reply', content: answer });
                break;
            case 'robot.goto':
                const location = action.split('"')[1];
                workingMemory.push({ type: 'robot action', content: "robot.goto(" + location + ")" });
                await robot.goto(location);
                break;
            case 'robot.detectHuman':
                workingMemory.push({ type: 'robot action', content: "robot.detectHuman()" });
                const detectResult = await robot.detectHuman();
                workingMemory.push({ type: 'human detection result', content: detectResult });
                break;
            case 'robot.end':
                workingMemory.push({ type: 'robot action', content: "robot.end()" });
                await robot.end();
                working = false;
                console.debug('任务结束' + workingMemory);
                break;
            default:
                console.warn('无法识别的行动类型:', actionType);
                break;
        }


    }
}


async function interactWithGPT(prompt) {
    const gptResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
    })
    console.log(gptResponse.data.choices[0].message.content);
    return gptResponse.data.choices[0].message.content;
}
        

  