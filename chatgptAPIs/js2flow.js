//用的是3.5
//结果保存在*_result文件里，终端也会输出

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var fs=require('fs');

// 创建一个将流数据写入文件的WriteStream对象
var outstream=fs.createWriteStream('./js2flow_result.txt');
//创造一个服务对象
const https = require('https');
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
const new_js2flow_input=`
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
await robot.speak('巡逻结束');`

let message_js2flow=[
  {role:'system',content:gpt_js2flow_system_set},
  { role: 'user', content: sample_j2flow_input },
  { role: 'assistant', content: sample_j2flow_output },
  { role: 'user', content: new_js2flow_input}
]
var postData = JSON.stringify({
  model: 'gpt-3.5-turbo',
  messages: message_js2flow,
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


