//用的是3.5
//结果保存在*_result文件里，终端也会输出

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var fs=require('fs');

// 创建一个将流数据写入文件的WriteStream对象
var outstream=fs.createWriteStream('./js2NLexplain_result.txt');
//创造一个服务对象
const https = require('https');
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
const new_js2NLexplain_input=`
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
var postData = JSON.stringify({
  model: 'gpt-3.5-turbo',
  messages: message_js2NLexplain,
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


