await robot.userRequest('打招呼');

const greetings = ['你好', '您好', '早上好', '下午好', '晚上好'];
const randomIndex = Math.floor(Math.random() * greetings.length);
const greeting = greetings[randomIndex];

await robot.speak(greeting + '，欢迎来到实验室。我是机器人小助手，请问有什么可以帮助您的吗？');