const request = require('request-promise');
const download = require('download');
const fs = require('fs');
const $URL = require('./gb2312.js');
const arg = process.argv;
const key = arg[2];
const progressBar = require('progress');

let urlPerfix = 'https://pic.sogou.com/pics?mode=1&reqType=ajax&reqFrom=result&tn=0'

let query = $URL.encode(key);

let loadedImgCount = 0;
let errorImgCount = 0;
let skipImgCount = 0;

function getImgPromise(start) {
    return new Promise((resolve) => {
        try {
            const url = `${urlPerfix}&start=${start}&query=${query}`;
            request(url).then(res => {
                res = JSON.parse(res);
                if (!res.isForbiden) {
                    let data = res.items;
                    let planList = [];
                    if (data) {
                        data.map(item => {
                            if (item.pic_url) {
                                planList.push(item.pic_url);
                            }
                        })
                    }
                    return planList;
                }
            }).then(planList => {
                let fileList = fs.readdirSync('./assets');
                console.log(`>> 已存图片总数为：${fileList.length}`);
                const bar = new progressBar('>> download [:bar] :percent\n', {
                    total: planList.length
                });
                let itemsOnPage = planList.length;
                let count = 0;
                let percentOnPage = 0;
                const stop = setInterval(() => {
                    count++;
                    if(count === 25) {
                        clearInterval(stop)
                        console.log(`>> 请求超时25s，跳转下一次请求，一共完成${loadedImgCount}次下载，一共跳过${skipImgCount}次，一共失败${errorImgCount}次`);
                        return getImgPromise(start + 48)
                    }
                }, 1000);
                planList.map((item, idx) => {
                    let a = item.split('/');
                    let name = a[a.length - 1];
                    if (fileList.indexOf(name) >= 0) {
                        skipImgCount++;
                        percentOnPage++;
                        bar.tick();
                    } else {
                        download(item, './assets', {
                            retries: 6
                        }).then(res => {
                            bar.tick();
                            loadedImgCount++;
                            percentOnPage++;
                            if (percentOnPage === itemsOnPage) {
                                clearInterval(stop);
                                console.log(`>> 跳转下一次请求，一共完成${loadedImgCount}次下载，一共跳过${skipImgCount}次，一共失败${errorImgCount}次`);
                                return getImgPromise(start + 48);
                            }
                        }).catch(err => {
                            errorImgCount++;
                            percentOnPage++;
                            if (percentOnPage === itemsOnPage) {
                                clearInterval(stop);
                                console.log(`>> 跳转下一次请求，一共完成${loadedImgCount}次下载，一共跳过${skipImgCount}次，一共失败${errorImgCount}次`);
                                return getImgPromise(start + 48);
                            }
                        })
                    }
                });
            });
        } catch (error) {
            console.log('----------------------error--------------------');
            return getImgPromise(start + 48);
        }
    });
}


getImgPromise(0)