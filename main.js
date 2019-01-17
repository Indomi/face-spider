const process = require('child_process')

for(let i=500;i<1000;i=i+48) {
    process.exec(`node renwu.js ${i}`, (err, stdout) => {
        if(err) {
            console.log(err);
        }else {
            console.log(`进程${i}`);
            console.log(stdout);
        }
    })
}