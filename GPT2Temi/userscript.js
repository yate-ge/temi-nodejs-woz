const members = ['小明', '小绿', '小白'];
const availableMembers = [];
let reply = '';

await robot.userRequest('预约开组会');

for (let i = 0; i < members.length; i++) {
  await robot.goto(members[i] + '的座位');
  const isPresent = await robot.detectHuman();
  if (isPresent) {
    const isAvailable = await robot.ask('您好，' + members[i] + '，您现在有时间参加组会吗？');
    if (isAvailable === '有的') {
      availableMembers.push(members[i]);
    }
  }
}

if (availableMembers.length > 0) {
  reply = '以下成员有时间参加组会：' + availableMembers.join('、');
} else {
  reply = '很遗憾，目前没有成员有时间参加组会。';
}

await robot.goto('客厅');
await robot.speak(reply);