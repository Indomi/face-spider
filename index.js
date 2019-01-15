const request = require('request-promise')
const fs = require('fs')
const download = require('download')
const MAX_PAGE = 10

const arg = process.argv
const start = arg[2]
const end = arg[3]

let urlPerfix = 'http://image.baidu.com/channel/listjson?rn=200&tag1=%E6%98%8E%E6%98%9F&tag2=%E5%85%A8%E9%83%A8&ie=utf8&pn='
let doneImg = 0
let doneImgArr = []
let skipCount = 0

function getImgUrlList(pageNum) {
    return new Promise((resolve, reject) => {
        
        return request(urlPerfix + pageNum).then(res => {
            let data = JSON.parse(res).data
            let imgArr = []
            data.map(item => {
                if(item.image_url) {
                    imgArr.push(item.image_url)
                }
            })
            console.log(`图片数量为：${imgArr.length}`);
            imgArr.map((item, idx) => {
                let temp = item.split('/')
                    let name = temp[temp.length - 1]
                if(doneImgArr.indexOf(name) >= 0) {
                    skipCount++;
                    console.log('图片已存在，跳过，共跳过' + skipCount + '次');
                    return;
                }else {
                    return download(item).then(data => {
                        setTimeout(function() {
                            fs.writeFile('dist1/'+name, data, {
                                encoding: 'binary'
                            }, () => {
                                console.log(`${name}下载成功`);
                                doneImg += 1;
                                doneImgArr.push(name)
                                console.log(`总共下载数量为：${doneImg}`);
                                if(doneImg === 200) {
                                    return resolve(pageNum + 1)
                                }
                            })  
                        }, 500)
                    })
                }
            })
            
        }).catch(err => {
            return reject(err)
        })
    })
}

let line = [0,1,2,3,4,5,6,7,8,9,10]

let promiseArr = []

for(let i=start;i < end;i++) {
    promiseArr.push(getImgUrlList(i))
}

Promise.all(promiseArr).then(() => {})