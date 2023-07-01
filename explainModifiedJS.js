//用的是3.5
//结果保存在*_result文件里，终端也会输出

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var fs=require('fs');

// 创建一个将流数据写入文件的WriteStream对象
var outstream=fs.createWriteStream('./explainModifiedJS_result.txt');
//创造一个服务对象
const https = require('https');

//默认设置
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
const originalCode = default_originalCode

//
const modifiedCode = default_modifiedCode

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
var postData_explainModifiedJS = JSON.stringify({
  model: 'gpt-3.5-turbo',
  messages: message_explainModifiedJS,
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

req.write(postData_explainModifiedJS);

req.end();


