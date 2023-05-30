//const socket = require('./ws.js');

import Robot from "./robotapi.js";
import {
    eventemitter
} from './ws.js';



const robot = new Robot();

await robot.wait(3);



async function reserveMeeting() {
  try {
    // 询问要找哪个实验室成员进行开会
    const member = await robot.ask('请问您要找哪个实验室成员进行开会？');

    // 移动到该成员的座位
    await robot.goto(`小${member}的座位`);

    // 询问该成员是否现在有时间参会，以及意向的开会地点
    const response = await robot.ask(`${member}，您现在有时间参会吗？您希望在哪个地点开会？`);

    // 返回客厅
    await robot.goto('客厅');

    // 告知会议预订结果
    await robot.speak(`${member}回答：${response}`);

  } catch (error) {
    // 如果检测不到人，则返回客厅并告知出现异常
    if (error === false) {
      await robot.goto('客厅');
      await robot.speak('出现异常，请重试。');
    }
  }
}

reserveMeeting();