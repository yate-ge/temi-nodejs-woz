
function print(delay, message) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        //console.log(message);
        resolve(message);
        }, delay);
    });
}

// let msg = await print(1000, 'Hello');
// console.log(msg);
// let msg2 = await print(1000, 'World');
// console.log(msg2);

// await print(1000, '!').then((msg) => {
//     console.log(msg);
// });


function print2(delay, message) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(message);
            //return resolve(message);
            resolve(message);
        }, delay);
    });

    console.log("hi!");
}

print2(1000, 'Hello');

// await print2(1000, 'Hello');
// print2(1000, 'World');




// print(1000, 'Hello').then(() => {
//     return print(2000, 'World');
// }
// ).then(() => {
//     return print(3000, '!');
// });

// await print(1000, 'Hello');
// print(0, 'hello again');
// await print(2000, 'World');
// print(0, 'world again');
// await print(2000, '!');




// 打印 print2(1000, 'Hello') 的返回值





