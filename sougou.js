const request = require('request-promise')
const fs = require('fs')
const download = require('download')
const querystring = require('querystring')
const arg = process.argv
const start = arg[2]
const end = arg[3]

let urlPerfix = 'https://pic.sogou.com/pics/channel/getAllRecomPicByTag.jsp?category=%E6%98%8E%E6%98%9F&len=100&start='

let key = ['全部','宋仲基','鹿晗','霍建华','林心如','陈学冬','杨幂','赵丽颖','吴秀波','张天爱','马天宇','刘诗诗','吴倩','胡歌','薛之谦','林允儿','刘涛','唐嫣','权志龙','杨洋','郑爽','周杰伦','古力娜扎','刘亦菲','宋慧乔','王子文','靳东','吴亦凡','范冰冰','李易峰','张艺兴','刘昊然','余文乐','迪丽热巴','exo','刘恺威','蒋欣','宋智孝','王凯','柳岩','张雨绮','林志玲','黄晓明','高圆圆','张馨予','张柏芝','少女时代']

let doneImg = 0
let doneImgArr = []
let skipCount = 0

function getImgUrlList(pageNum, keyItem) {
    return new Promise((resolve, reject) => {
        // return request(urlPerfix + pageNum + '&tag=' + querystring.escape(keyItem)).then(res => {
            return request(urlPerfix + pageNum + '&tag=' + keyItem).then(res => {
            let data = JSON.parse(res).all_items
            let imgArr = []
            if(data) {
                data.map(item => {
                    if (item.pic_url) {
                        imgArr.push(item.pic_url)
                    }
                })
                console.log(`图片数量为：${imgArr.length}`);
                imgArr.map((item, idx) => {
                    let temp = item.split('/')
                    let name = temp[temp.length - 1] + '.jpg'
                    if (doneImgArr.indexOf(name) >= 0) {
                        skipCount++;
                        console.log('图片已存在，跳过，共跳过' + skipCount + '次');
                        return;
                    } else {
                        return download(item).then(data => {
                            setTimeout(function () {
                                fs.writeFile('dist1/' + name, data, {
                                    encoding: 'binary'
                                }, () => {
                                    console.log(`${name}下载成功`);
                                    doneImg += 1;
                                    doneImgArr.push(name)
                                    console.log(`总共下载数量为：${doneImg}`);
                                    if (doneImg === 200) {
                                        return resolve(pageNum + 1)
                                    }
                                })
                            }, 500)
                        })
                    }
                })
            }
        }).catch(err => {
            return reject(err)
        })
    })
}

let line = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

let promiseArr = []

for (let i = start; i < end; i++) {
    for(let n = 0;n<key.length;n++) {
        promiseArr.push(getImgUrlList(i, key[n]))
    }
}

Promise.all(promiseArr).then(() => {
    process.exit(0);
})