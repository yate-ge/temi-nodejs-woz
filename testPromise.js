
function print(delay, message) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        console.log(message);
        resolve();
        }, delay);
    });
}

// print(1000, 'Hello').then(() => {
//     return print(2000, 'World');
// }
// ).then(() => {
//     return print(3000, '!');
// });

await print(1000, 'Hello');
print(0, 'hello again');
await print(2000, 'World');
print(0, 'world again');
await print(2000, '!');
