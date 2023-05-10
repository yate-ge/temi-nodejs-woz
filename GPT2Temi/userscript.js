// async function main() {
//   try {
//     await robot.goto("葛亚特的座位");
//     await robot.wait(5000); // 等待5秒，看看葛亚特是否在座位上
//     const detectResult = await robot.detectHuman();
//     if (detectResult) {
//       await robot.speak("葛亚特在座位上。");
//     } else {
//       await robot.speak("很抱歉，葛亚特不在座位上。");
//     }
//     await robot.goto("客厅");
//     await robot.speak("经过查询，葛亚特" + (detectResult ? "在" : "不在") + "座位上。");
//   } catch (error) {
//     console.log(error);
//     await robot.goto("充电桩"); // 出现错误时，前往充电桩
//   }
// }

// main();