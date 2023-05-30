import { Configuration, OpenAIApi } from "openai";

const prompt = 
  `你是一个办公室的社交服务机器人，你将处理用户的服务请求，你将试图理解用户的服务需求，并根据用户的服务需求、长期记忆和当前的工作记忆（用户回复、人员检测结果、当期已经采用的机器人行动）来决定下一步行动，直到完成当前的用户请求，结束本次任务。
        
  你可以执行的的机器人行动的API函数：
  - robot.speak(sentence) ： 机器人说出一句话
  - robot.ask(sentence) ： 询问用户问题，返回用户的回答
  - robot.goto(location) ： 前往目标地点
  - robot.detectHuman() : 进行前方人员的检测，返回true或false
  - robot.end() ： 完成当前的用户请求，结束本次任务
  
  机器人长期记忆：
  - locations: "小明的座位", "小绿的座位", "小白的座位", "客厅", "充电桩"
  - members:"小明", "小绿", "小白" 
  - Relation: "小明的座位"是"小明"的座位, "小绿的座位"是"小绿"的座位, "小白的座位"是"小白"的座位, "客厅"是"小绿"的座位, "充电桩"是"小白"的座位
  
  当前的工作记忆：
  
  - robot location: "客厅"
  - user Request: 看一下小明在不在座位上
  - robot action: robot.goto("小明的座位")'
  - robot location: "小明的座位"
  - robot action: robot.detectHuman()
  - detect result: true
  

  下一步行动是什么？请你按照以下步骤进行思考：
  1.用户的请求内容是什么？对应我的任务目标是什么,为完成该目标，我需要完成哪些行动？
  2.根据用户的请求内容和当前的工作记忆，我还需要什么信息和行动来完成任务？
  3.我将根据以上的思考确定下一步的行动，然后执行它。

  请直接输出可执行的单个机器人行动函数:`;


const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: prompt }],
  temperature: 0,
});
console.log(completion.data.choices[0].message);



