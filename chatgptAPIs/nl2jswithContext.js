//用的是3.5
//结果保存在*_result文件里，终端也会输出

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var fs=require('fs');

// 创建一个将流数据写入文件的WriteStream对象
var outstream=fs.createWriteStream('./nl2jswithContext_result.js');
//创造一个服务对象
const https = require('https');

//默认设置
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
const currentCode = default_code

//接收用户的指令
const userInput = default_instruction

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
var postData_nl2jswithContext = JSON.stringify({
  model: 'gpt-3.5-turbo',
  messages: message_nl2jswithContext,
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

req.write(postData_nl2jswithContext);

req.end();


