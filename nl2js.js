//用的是3.5
//结果保存在*_result文件里，终端也会输出

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var fs=require('fs');

// 创建一个将流数据写入文件的WriteStream对象
var outstream=fs.createWriteStream('./nl2js_result.js');
//创造一个服务对象
const https = require('https');
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
const new_input=`带领客人参观实验室，参观完一个地方后询问客人下一个想参观的地方是哪里，直至参观完毕。如果客人不想再参观就提前结束。`

let message_nl2js=[
  {role:'system',content:gpt_nl2js_system_set},
  { role: 'user', content: sample_input },
  { role: 'assistant', content: sample_output },
  { role: 'user', content: new_input}
]
var postData = JSON.stringify({
  model: 'gpt-3.5-turbo',
  messages: message_nl2js,
});

var options = {
  hostname: 'openai.api2d.net',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer fk194544-70mmb1cIjc1dbEALE2ytd6obQL9WkvwD', // <-- 把 fkxxxxx 替换成你自己的 Forward Key，注意前面的 Bearer 要保留，并且和 Key 中间有一个空格。
  },
};

var req = https.request(options, (res) => {
  //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);

  res.on('data', (d) => {
    console.log(JSON.parse(d)["choices"][0]["message"]["content"]);
    outstream.write(JSON.parse(d)["choices"][0]["message"]["content"],'utf8'); //储存chatgpt给出的结果

    //console.log('文件写入完毕。');
    //process.stdout.write(d);
  });
});


req.on('error', (e) => {
  console.error(e);
});

req.write(postData);

req.end();


