//后端转发前端请求到chatgpt api
import express from 'express';
import axios from 'axios-https-proxy-fix';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import vm from 'vm';
import runUserScript from '../GPT2Temi/js2temiService.js';



dotenv.config();
const app = express();
const port = process.env.API_PORT || 3001;


// 设置SSE响应头
function setupSSEHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

// 自然语言转js代码
async function nl2js(req,res) {
  //const text = req.body.text || 'hi';
  try {
    //gpt规则设定
const gpt_nl2js_system_set=`
you are a robot program generator. you will generate javascript code for robot control according my request.
we have access to the following functions, each function use robot api to control robot to execute specific behavior.
robot.speak(sentence): make robot to say that the content is sentence. this function will return a promise , so this 
function can be await.
robot.ask(sentence): make robot to ask user and return user's reply . this function will return a promise with value 
is reply content.
robot.goto(location): make robot move to a location according to pre-defined location name. this function will return 
a promise when arrived.T The defined locations currently include "小明的座位", "小绿的座位", "小白的座位", "客厅", and
"充电桩". "小明", "小绿", and "小白" are all members in the lab.
robot.detectHuman(): this function will return a promise which value is true(execute resolve()) when detect a human. 
return a promise which value is false (execute resolve()) when do not detect a human after 5sec delay.
robot.userRequest(task): The "task" parameter is the keyword used to initiate the robot service. This function will return 
a promise when user input this task keyword.
The code you generate is for a social service bot in the lab, and when generating the code, you need to consider:
1.You can only use the functions provided above for control the robot, do not call other APIs.
2.The code should start with robot.userRequest() function. The generated code serves as a service of the robot. Users can 
call this service at any time by using specific task keywords.
3.Communicate with users in Chinese.
4.When calling robot.speak() or robot.ask() functions, do not use function methods and expressions that are difficult for the user to understand, such as join
4.Keep the code as short as possible
There is no need to include any content outside of the code, nor is there a requirement to explain the code. If the complete
code cannot be output in one response, it can be divided into multiple outputs.
Please generate the answer in the format of Node.js.
`
//样例问题
const sample_input=`
实现一个预约开会的服务。你会询问我要找哪个实验室成员进行开会。然后前往该成员的座位，询问他是否现在有时间参会，以及意向的开会地点。\
然后返回客厅，将结果告诉我。
`
//样例回复
const sample_output=`
const reply;
const location;
const targetMember；

await robot.userRequest('预约开会');
targetMember = await robot.ask('您想找哪个实验室成员进行开会？');
await robot.goto(targetMember + '的座位');
const isPresent = await robot.detectHuman();
if(isPresent){
    const isAvailable = await robot.ask('您好，' + targetMember + '，您现在有时间参会吗？');

    if(isAvailable=="有的"){
        location = await robot.ask('您想在哪里开会？');
        reply = targetMember + '有时间开会，他选择的地点是 ' + location ;

    }else{
        reply = targetMember + '没有时间开会';
    }

    await robot.speak('谢谢你的回复');

}else{
    reply = targetMember + '不在座位上';
}

await robot.goto('客厅');
await robot.speak(reply);
`
//接收用户的指令
const new_input=req.body.text ||`带领客人参观实验室，参观完一个地方后询问客人下一个想参观的地方是哪里，直至参观完毕。如果客人不想再参观就提前结束。`

    let message_nl2js=[
  {role:'system',content:gpt_nl2js_system_set},
  { role: 'user', content: sample_input },
  { role: 'assistant', content: sample_output },
  { role: 'user', content: new_input}
]
  // 要发送到OpenAI API的请求
      const openaiRequest = {
          model: 'gpt-3.5-turbo',
          stream: false,
        messages: message_nl2js
      };     
      
      const openaiAxios = axios.create({
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer fk194544-70mmb1cIjc1dbEALE2ytd6obQL9WkvwD`
          },
          //proxy: proxy
      });


      const openaiResponse = await openaiAxios.post('https://openai.api2d.net/v1/chat/completions', openaiRequest);

      //得到结果      
      console.log(openaiResponse.data.choices[0].message.content);
      res.send(openaiResponse.data.choices[0].message.content);

      
  } catch (error) {
      console.error('error while getting openai chat message', error);
      res.status(500).send('error while getting openai chat message');
  }
}

//有上下文的修改
async function nl2jswithContext(req,res) {
  //const text = req.body.text || 'hi';
  try {
    const default_code = `
const meetingTime = {
  '周四上午': 0,
  '周四下午': 0
};

await robot.userRequest('组会时间收集');
const members = ['小明', '小绿', '小白'];
for(let i = 0; i < members.length; i++){
  await robot.goto(members[i] + '的座位');
  const isPresent = await robot.detectHuman();
  if(isPresent){
      const time = await robot.ask('您好，' + members[i] + '，您能告诉我您更倾向于哪个时间段的组会吗？（周四上午/周四下午）');
      if(time === '周四上午'){
          meetingTime['周四上午']++;
      }else if(time === '周四下午'){
          meetingTime['周四下午']++;
      }
      await robot.speak('谢谢您的回答');
  }
}

await robot.goto('客厅');
await robot.speakobot.goto('客厅');
await robot.speak('大家的组会时间意愿如下：' + JSON.stringify(meetingTime));
`
    const default_instruction = "你只需要问小明和小绿就可以了"

    //code context
    const currentCode = req.body.text ||default_code

    //接收用户的指令
    const userInput = req.body.text ||default_instruction
    //gpt规则设定
    const gpt_nl2jswithContext_system_set=`
    you are robot program generator. you will modify the code accroding to the user's instruction and the current code.
    
    current code : ${currentCode}
    user instruction : ${userInput}
    
    your output code:
    `




    let message_nl2jswithContext=[
      {role:'system',content:gpt_nl2jswithContext_system_set},
]
  // 要发送到OpenAI API的请求
      const openaiRequest = {
          model: 'gpt-3.5-turbo',
          stream: false,
        messages: message_nl2jswithContext,
      };     
      
      const openaiAxios = axios.create({
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer fk194544-70mmb1cIjc1dbEALE2ytd6obQL9WkvwD`
          },
          //proxy: proxy
      });


      const openaiResponse = await openaiAxios.post('https://openai.api2d.net/v1/chat/completions', openaiRequest);

      //得到结果      
      console.log(openaiResponse.data.choices[0].message.content);
      res.send(openaiResponse.data.choices[0].message.content);

      
  } catch (error) {
      console.error('error while getting openai chat message', error);
      res.status(500).send('error while getting openai chat message');
  }
}

// js代码转mermaid流程图
async function js2flow(req,res) {
  //const text = req.body.text || 'hi';
  try {
    //gpt规则设定
    const gpt_js2flow_system_set=`
    ## 任务目标：
    你是一个Mermaid流程图绘制专家，你的任务目标是将我输入的javascript代码所表示的程序逻辑用mermiad流程图进行表示。用来支持非程序员用户理解程序执行逻辑。
    
    ## 任务上下文：
    
    ### 应用情景：
    我输入的javascript描述了一个室内服务机器人的定制任务的执行逻辑。用户通过服务请求关键词来开启服务流程。该服务机器人可执行的行动包括“前往地点”、“说话”、“询问”、“接受用户请求”、“人物检测”：
      通过“接受用户请求”开启一个个性化服务；
      通过“询问”，“人物检测”来从环境和用户获取执行任务所必要的信息；
      通过“说话”向用户传达信息，以向用户提供完成任务所需要向用户提供的信息；
      通过“前往地点”来在空间中移动。
    基于这些行动单元给用户提供个性化的服务。
    
    ### Javascript API
    - \`robot.userRequest(taskKeyword)\`: the entry point for service.
    - \`robot.speak(sentence)\`: make robot to say.
    - \`robot.ask(sentence)\`: make robot to ask user, return user reply content(String).
    - \`robot.goto(location)\`: make robot move to a location.
    - \`robot.detectHuman()\`:make robot to detect human in front of robot. Return true when detect someone or false have not detect anyone after 5 sec.
    
    ### Mermaid节点定义
    - \`r_01(["userRequest:{{taskKeyword}}"])\`:该节点对应 \`robot.userRequest(taskKeyword)\`,是流程图的起点。
    - \`s_01["speak: {{description}}]\`: 该节点对应\`robot.speak(sentence)\`，{{description}}为根据程序执行上下文对机器人所要传达信息的描述。
    - \`a_01["ask:{{description}}"]\`: 该节点对应\`robot.ask(sentence)\`,{{description}}为根据程序执行上下文对机器人所要询问用户的信息内容的描述。
    - \`g_01["goto:{{description}}"]\`: 该节点对应\`robot.goto(location)\`,{{description}}为根据程序执行上下文对机器人所要前往地点的描述。
    - \`d_01["detectHuman"]\`: 该节点对应\`robot.detectHuman()\`。
    - \`c_01{"condition: {{description}}"}\` : 该节点对应javascript代码中的if-else语句，以及while循环的条件判断。{{description}}为根据程序执行上下文对判断的信息内容和条件的描述。
    - \`f_01{{"forLoop: {{description}}"}}\` : 该节点对应javascript代码中的\`for (起始值; 结束条件; 每次循环后的操作)\`循环。 你将根据程序上下文对机器人在该循环体的行为进行描述，描述将要从数组或者对象中遍历取得的信息内容。
    - \`h_01["info:{{description}}"]\` : 该节点对应javascript代码中的赋值。该节点不能作为流程图的起点或终点。你将根据程序上下文对机器人要处理的信息进行具体描述。
    - \`j_01{{"loopEnd:{{description}}"}}\` : 该节点表示退出for循环或者while循环,{{description}}为告知用户结束了对应的遍历和循环。
    - \`k_01(["end:任务结束"])\` : 该节点跟在Mermaid代码末尾，是流程图的终点，作为JavaScript代码已经执行完毕的标志。
    
    ### 格式要求
    - 语法格式: 代码符合mermaid 语法要求，能够正常渲染，字符串中不包含特殊字符。
    - 结构要求：mermaid流程图应当最后只有唯一的起点：\`r_01(["userRequest:{{taskKeyword}}"])\`节点，和唯一的终点：\`k_01(["end:任务结束"])\`节点
    - id: 节点的id按照\`节点类型_序号\`进行命名，比如\`r_01["userRequest:送信服务"]\`,\`s_01["speak: 告知即将前往“目标地点”]\`,\`s_02["speak: 告知是否完成送行服务，如果未完成，告知未完成原因]\`。
    - text: 节点的文本内容请按照"### Mermaid节点定义"中所定义的文本格式。
    - link：link一般不添加text文本内容。但是如果是 \`c_01{{"condition: {{description}}"}}\`作为起点的link，请在link上标注判断条件："true"或者是"false"。确保连线准确地描述了机器人服务的实现逻辑,不存在错误的节点的关系。
    
    
    ## 思考流程：
    你将按照以下指示来执行任务：
    1. 首先你将按照"## 任务目标", "### 应用情景" 以及 "### Javascript API"来理解我输入的代码上下文逻辑。并在“服务机器人给用户提供个性化的服务”这个层面去理解每一行代码的作用，所表示的机器人行为逻辑或信息处理逻辑。
    2. 然后你将找到程序的入口：\`await robot.userRequest(taskKeyword)\`，按照"### Mermaid节点定义"转换为流程图的起点。如果有变量在\`robot.userRequest()\`前声明，那么你将用\`h_01["info :{{description}}"]\`连在\`r_01["userRequest:{{taskKeyword}}"]\`后进行描述。
    3. 然后你将按照你理解的上下文逻辑，根据 "### Mermaid节点定义" 和 “### 格式要求”来完成整个流程图的绘制。其中你要注意：
      IF “ask()”
      THEN “\`a_01["ask:{description}"]\`”节点后面一定会有一个\`h_01["info :{description}"]\`来描述获取用户回复。
    
      IF "detectHuman()"
      THEN 根据detectHuman()返回的结果是作为信息还是判断条件，节点后面会连接\`h_01["info :{description}"]\` 或者是 \`c_01{"condition: {description}"}\`
    
      IF "speak()" ,“ask”,"goto" 的字符串参数中含有变量。
      THEN 你将根据上下文逻辑来准确描述该变量所表示的信息。
    
      IF "switch判断"
      THEN 你将其用if语句的结果进行表示。用\`c_01{{"condition: {description}"}}\`描述。
    
      IF "for循环"
      THEN 你将用\`f_01{{"forLoop: {description}}"}\`进行表示。循环结束后需要再后续出现一个节点\`j_01{"loopEnd:{description}"}\`作为循环结束的标志。
    
      IF "while循环"
      THEN 你将用\`c_01{"condition: {description}"}\`作为循环的条件判断。当{description}不再满足时结束循环，循环结束后需要后续出现一个节点\`j_01{"loopEnd:{description}"}\`作为循环结束的标志。
    
        IF "else if判断"
      THEN 你将在最近的一个if判断后再进行一个判断。用\`c_01{"condition: {description}"}\`作为循环的条件判断。
    
    
    
    4. 在完成整个流程图的绘制后，你将根据“## 任务上下文”对整个mermaid流程图代码进行检查和优化。
    
    Please generate the answer in the format of mermaid flow.
    `
//样例问题
const sample_j2flow_input=`
await robot.userRequest('巡逻');
const locations = ['小明的座位', '小绿的座位', '小白的座位'];
for(let i = 0; i < locations.length; i++){
    await robot.goto(locations[i]);
    const isPresent = await robot.detectHuman();
    if(isPresent){
        await robot.speak('救命啊，有人在这里！');
    }
}
await robot.goto('客厅');
await robot.speak('巡逻结束');
`
//样例回复
const sample_j2flow_output=`
graph TB
r_01(["userRequest:巡逻"])
h_01["info:定义locations数组，记录巡逻地点"]
r_01 --> h_01
f_01{"forLoop:从position列表中取出当前的position信息"}
h_01 --> f_01
g_01["goto:前往当前locations位置"]
f_01 --"处理当前position信息"--> g_01
f_01 --"完成遍历循环"--> j_01
d_01["detectHuman"]
g_01 --> d_01
c_01{"condition: 检测到人"}
d_01 --> c_01
s_01["speak:告知检测到有人在当前位置"]
c_01 --true--> s_01
j_01{"loopEnd:退出循环"}
s_01 --> f_01
c_01 --false--> f_01
g_02["goto:前往客厅"]
j_01 --> g_02
s_02["speak:告知巡逻结束"]
g_02 --> s_02
k_01(["end:任务结束"])
s_02 --> k_01
`
//接收用户的指令
const new_js2flow_input=req.body.text ||`

const teaOptions = ['红茶', '绿茶'];
const teaDemands = {};

await robot.userRequest('签到');
for (let member of ['小明', '小绿', '小白']) {
    await robot.goto(member + '的座位');
    const isPresent = await robot.detectHuman();
    if (isPresent) {
        const reply = await robot.ask('您好，' + member + '，请问您要喝什么茶？（红茶/绿茶）');
        if (teaOptions.includes(reply)) {
            teaDemands[member] = reply;
        } else {
            await robot.speak('对不起，您的输入有误，请重新输入');
        }
    } else {
        await robot.speak(member + '不在座位上，快去救命！');
    }
}
await robot.goto('客厅');
await robot.speak('大家的下午茶需求已经收集完毕，分别是：' + JSON.stringify(meetingTime));`
let message_js2flow=[
  {role:'system',content:gpt_js2flow_system_set},
  { role: 'user', content: sample_j2flow_input },
  { role: 'assistant', content: sample_j2flow_output },
  { role: 'user', content: new_js2flow_input}
];
  // 要发送到OpenAI API的请求
      const openaiRequest = {
          model: 'gpt-3.5-turbo',
          stream: false,
        messages: message_js2flow
      };     
      
      const openaiAxios = axios.create({
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer fk194544-70mmb1cIjc1dbEALE2ytd6obQL9WkvwD`
          },
          //proxy: proxy
      });


      const openaiResponse = await openaiAxios.post('https://openai.api2d.net/v1/chat/completions', openaiRequest);

      //得到结果      
      console.log(openaiResponse.data.choices[0].message.content);
      res.send(openaiResponse.data.choices[0].message.content);

      
  } catch (error) {
      console.error('error while getting openai chat message', error);
      res.status(500).send('error while getting openai chat message');
  }
}

// 自然语言解释js代码
async function js2NLexplain(req,res) {
  //const text = req.body.text || 'hi';
  try {
    //gpt规则设定
    const gpt_js2NLexplain_system_set=`
你将用言简意赅的自然语言解释用户输入的代码所控制的机器人行为。该代码是用于实现一个服务机器人的定制服务,其中调用的机器人API如下:

robot.speak(sentence): make robot to say that the content is sentence. this function will return a promise , so this 
function can be await.
robot.ask(sentence): make robot to ask user and return user's reply . this function will return a promise with value 
is reply content.
robot.goto(location): make robot move to a location according to pre-defined location name. this function will return 
a promise when arrived.T The defined locations currently include "小明的座位", "小绿的座位", "小白的座位", "客厅", and
"充电桩". "小明", "小绿", and "小白" are all members in the lab.
robot.detectHuman(): this function will return a promise which value is true(execute resolve()) when detect a human. 
return a promise which value is false (execute resolve()) when do not detect a human after 5sec delay.
robot.userRequest(task): The "task" parameter is the keyword used to initiate the robot service. This function will return 
a promise when user input this task keyword.

请按照以上的要求输出解释文字。
`
//样例问题
const sample_j2flow_input=`
const reply;
const location;
const targetMember;

await robot.userRequest('预约开会');
targetMember = await robot.ask('您想找哪个实验室成员进行开会？');
await robot.goto(targetMember + '的座位');
const isPresent = await robot.detectHuman();
if(isPresent){
    const isAvailable = await robot.ask('您好，' + targetMember + '，您现在有时间参会吗？');

    if(isAvailable=="有的"){
        location = await robot.ask('您想在哪里开会？');
        reply = targetMember + '有时间开会，他选择的地点是 ' + location ;

    }else{
        reply = targetMember + '没有时间开会';
    }

    await robot.speak('谢谢你的回复');

}else{
    reply = targetMember + '不在座位上';
}

await robot.goto('客厅');
await robot.speak(reply);
`
//样例回复
const sample_j2flow_output=`服务启动关键词：预约开会
服务流程：
1. 机器人首先接收到用户要预约开会的请求。
2. 机器人会问用户想和实验室里的哪个人开会。
3. 得到用户的回答后，机器人会去找那个人。
4. 到达那个人的座位后，机器人会看看座位上有没有人。
5. 如果座位上有人，机器人会问他有没有时间开会。
   - 如果他说有时间，机器人会再问他想在哪里开会。然后，机器人会记住他的回答，并告诉用户他有空并且他选择的开会地点。
   - 如果他说没有时间，机器人会告诉用户他没有时间开会。
   - 不论他有没有时间，机器人都会对他说：“谢谢你的回复”。
6. 如果座位上没有人，机器人会告诉用户那个人不在座位上。
7. 最后，无论结果如何，机器人都会回到客厅，并把情况告诉用户。
`
//接收用户的指令
const new_js2NLexplain_input=req.body.text ||`

const teaOptions = ['红茶', '绿茶'];
const teaDemands = {};

await robot.userRequest('签到');
for (let member of ['小明', '小绿', '小白']) {
    await robot.goto(member + '的座位');
    const isPresent = await robot.detectHuman();
    if (isPresent) {
        const reply = await robot.ask('您好，' + member + '，请问您要喝什么茶？（红茶/绿茶）');
        if (teaOptions.includes(reply)) {
            teaDemands[member] = reply;
        } else {
            await robot.speak('对不起，您的输入有误，请重新输入');
        }
    } else {
        await robot.speak(member + '不在座位上，快去救命！');
    }
}
await robot.goto('客厅');
await robot.speak('大家的下午茶需求已经收集完毕，分别是：' + JSON.stringify(meetingTime));`
let message_js2NLexplain=[
  {role:'system',content:gpt_js2NLexplain_system_set},
  { role: 'user', content: sample_j2flow_input },
  { role: 'assistant', content: sample_j2flow_output },
  { role: 'user', content: new_js2NLexplain_input}
]
  // 要发送到OpenAI API的请求
      const openaiRequest = {
          model: 'gpt-3.5-turbo',
          stream: false,
        messages: message_js2NLexplain
      };     
      
      const openaiAxios = axios.create({
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer fk194544-70mmb1cIjc1dbEALE2ytd6obQL9WkvwD`
          },
          //proxy: proxy
      });


      const openaiResponse = await openaiAxios.post('https://openai.api2d.net/v1/chat/completions', openaiRequest);

      //得到结果      
      console.log(openaiResponse.data.choices[0].message.content);
      res.send(openaiResponse.data.choices[0].message.content);

      
  } catch (error) {
      console.error('error while getting openai chat message', error);
      res.status(500).send('error while getting openai chat message');
  }
}

//js代码优化
async function explainModifiedJS(req,res) {
  //const text = req.body.text || 'hi';
  try {
    const default_originalCode = `
const locations = ["小明的座位", "小绿的座位", "小白的座位"];
let isPatrolling = true;
let target = null;
await robot.userRequest('巡逻');
while(isPatrolling){
    for(let i = 0; i < locations.length; i++){
        await robot.goto(locations[i]);
        const isPresent = await robot.detectHuman();
        if(isPresent){
            isPatrolling = false;
            target = locations[i];
            break;
        }
    }
}

await robot.goto('客厅');
await robot.speak(target + '在座位上。');
`
const default_modifiedCode = `const locations = ["小明的座位", "小绿的座位", "小白的座位"];
let isPatrolling = true;
let target = null;
await robot.userRequest('巡逻');
while(isPatrolling){{
    for(let i = 0; i < locations.length; i++){{
        await robot.goto(locations[i]);
        const isPresent = await robot.detectHuman();
        if(isPresent){{
            robot.speal('你好呀');
            isPatrolling = false;
            target = locations[i];
            break;
        }}
    }}
}}

await robot.goto('客厅');
await robot.speak(target + '在座位上。');`

//code context
      const originalCode = req.body.origin;

//
      const modifiedCode = req.body.modified;

    //gpt规则设定
    const gpt_explainModifiedJS_system_set=`
    你将用言简意赅的自然语言解释相比于原代码，修改后的代码所改变的机器人行为。
    
    original code:${originalCode}
    modified code:${modifiedCode}
    
    your explain:
    `
    



    let message_explainModifiedJS=[
      {role:'system',content:gpt_explainModifiedJS_system_set},
    ]

  // 要发送到OpenAI API的请求
      const openaiRequest = {
          model: 'gpt-3.5-turbo',
          stream: false,
        messages: message_explainModifiedJS
      };     
      
      const openaiAxios = axios.create({
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer fk194544-70mmb1cIjc1dbEALE2ytd6obQL9WkvwD`
          },
          //proxy: proxy
      });


      const openaiResponse = await openaiAxios.post('https://openai.api2d.net/v1/chat/completions', openaiRequest);

      //得到结果      
      console.log(openaiResponse.data.choices[0].message.content);
      res.send(openaiResponse.data.choices[0].message.content);

      
  } catch (error) {
      console.error('error while getting openai chat message', error);
      res.status(500).send('error while getting openai chat message');
  }
}


async function js2temi(req,res) {
  //const text = req.body.text || 'hi';
    try {
      
        const jscode = req.body.text || `
          robot.speak('部署失败，请检查代码');
        `

    // 将 JavaScript 代码写入 userscript.js 文件
        fs.writeFileSync('./GPT2Temi/userscript.js', jscode, 'utf8');
        
        // 运行代码
        runUserScript();

        res.send('部署成功');

    } catch (error) {
        console.error('error while setting code to temi', error);
        res.status(500).send('error while getting openai chat message');
    }
}

// 设置路由

app.use(cors());
app.use(express.json());
// app.use(cors(
// //     {
// //   origin: 'http://localhost:8080',
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   allowedHeaders: ['Content-Type']
// //     }
// ));

const APIs=express.Router();
app.use('/APIs',APIs)//拆分路由

APIs.post('/nl2js', nl2js); //注册在/APIs/nl2js
APIs.post('/nl2jswithContext',nl2jswithContext);
APIs.post('/js2flow',js2flow);
APIs.post('/js2NLexplain',js2NLexplain);
APIs.post('/explainModifiedJS', explainModifiedJS);
APIs.post('/js2temi', js2temi);
// 启动服务器
app.listen(port,'0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});