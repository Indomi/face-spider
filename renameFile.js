const fs = require('fs');

const fileList = fs.readdirSync('./assets');
let count = 0;
fileList.map(item => {
    let lowerName = item.toLowerCase();
    if(!(lowerName.endsWith('.jpg') || lowerName.endsWith('.png') || lowerName.endsWith('.jpeg'))) {
        fs.renameSync(item, item.split('.')[0] + '.jpg');
        count++;
        console.log(`完成${count}个文件重命名`);
    }
})