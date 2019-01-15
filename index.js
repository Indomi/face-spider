const request = require('request-promise')
const fs = require('fs')
const download = require('download')
const MAX_PAGE = 10

let urlPerfix = 'http://image.baidu.com/channel/listjson?rn=200&tag1=%E6%98%8E%E6%98%9F&tag2=%E5%85%A8%E9%83%A8&ie=utf8&pn='
let doneImg = 0

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
                return download(item).then(data => {
                    let temp = item.split('/')
                    let name = temp[temp.length - 1] + Date.parse(new Date())
                    setTimeout(function() {
                        fs.writeFile('dist/'+name, data, {
                            encoding: 'binary'
                        }, () => {
                            console.log(`${name}下载成功`);
                            doneImg += 1;
                            console.log(`总共下载数量为：${doneImg}`);
                            if(doneImg === 20) {
                                return resolve(pageNum + 1)
                            }
                        })  
                    }, 500)
                })
            })
            
        }).catch(err => {
            return reject(err)
        })
    })
}

let line = [0,1,2,3,4,5,6,7,8,9,10]

let promiseArr = []

for(let i=1;i < 10000;i++) {
    promiseArr.push(getImgUrlList(i))
}

Promise.all(promiseArr).then(() => {})
// async function doIt() {
//     const i = await getImgUrlList(0)
//     console.log(i);
//     const i2 = await getImgUrlList(i)
// }

// doIt()