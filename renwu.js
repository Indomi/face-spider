const request = require('request-promise')
const fs = require('fs')
const download = require('download')
const querystring = require('querystring')
const arg = process.argv
const start = arg[2]
const end = arg[3]

// let urlPerfix = 'https://pic.sogou.com/pics/channel/getAllRecomPicByTag.jsp?category=%E6%98%8E%E6%98%9F&len=100&start='
let urlPerfix = 'https://pic.sogou.com/pics?query=%CB%A7%B8%E7&mode=1&reqType=ajax&reqFrom=result&tn=0&start=';

// let key = ['全部','宋仲基','鹿晗','霍建华','林心如','陈学冬','杨幂','赵丽颖','吴秀波','张天爱','马天宇','刘诗诗','吴倩','胡歌','薛之谦','林允儿','刘涛','唐嫣','权志龙','杨洋','郑爽','周杰伦','古力娜扎','刘亦菲','宋慧乔','王子文','靳东','吴亦凡','范冰冰','李易峰','张艺兴','刘昊然','余文乐','迪丽热巴','exo','刘恺威','蒋欣','宋智孝','王凯','柳岩','张雨绮','林志玲','黄晓明','高圆圆','张馨予','张柏芝','少女时代']

let doneImg = 0
let doneImgArr = []
let skipCount = 0

function getImgDownload(num) {
    return new Promise((resolve, reject) => {
        request(urlPerfix + num).then(res => {
            let fileList = fs.readdirSync('./renwu');
            console.log(`已存图片总数为：${fileList.length}`);
            let data = JSON.parse(res).items
            let imgArr = []
            let singleCount = 0;
            if (data) {
                data.map(item => {
                    if (item.pic_url) {
                        imgArr.push(item.pic_url)
                    }
                })
                console.log(`图片数量为：${imgArr.length}`);
                imgArr.map((item, idx) => {
                    let temp = item.split('/')
                    let name = temp[temp.length - 1].endsWith('.jpg') ? temp[temp.length - 1] : temp[temp.length - 1] + '.jpg'
                    if (fileList.indexOf(name) >= 0) {
                        skipCount++;
                        singleCount++;
                        console.log('图片已存在，跳过，共跳过' + skipCount + '次');
                        if (singleCount >= 47) {
                            resolve(num);
                        }
                        return;
                    } else {
                        const stop = setInterval(() => {
                            console.log('正在下载中.....');
                        }, 2000);
                        return download(item).then(data => {
                            clearInterval(stop)
                            fs.writeFile('renwu/' + name, data, {
                                encoding: 'binary'
                            }, () => {
                                singleCount++;
                                if (singleCount >= 47) {
                                    resolve(num);
                                }
                                console.log(`${name}下载成功`);
                                doneImg += 1;
                                fileList.push(name)
                                console.log(`总共下载数量为：${doneImg}`);
                            })
                        }).catch(() => {
                            console.log('download error!');
                            singleCount++;
                            if (singleCount >= 47) {
                                resolve(num);
                            }
                        })
                    }
                })
            }
        }).catch(err => {
            console.log(err);
        })
    });
}

getImgDownload(start).then((num) => {
    // getImgDownload(num + 48).then((num1) => {
    //     getImgDownload(num1 + 48);
    // })
    process.exit(1);
})
let seconds = 1;
setInterval(() => {
    seconds++;
    console.log(`------------------------------------------${seconds}s----------------------------------------------------------`);
}, 1000);