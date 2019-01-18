# face-spider

## 简易nodejs爬虫

> 需求是爬取20000张人像图片，比较匆忙写来写去最后写成了这个样子

### 1.使用方法

``` bash
git clone https://github.com/Indomi/face-spider.git
npm install
node index.js <key>
#key为想爬取的关键词
#想结束爬取自己ctrl + c吧
```

### 2.关键字编码方式

- 该站点（爬的啥站自己看代码吧）关键字使用了gb2312格式的编码，找了一个库`gbk.js`

- start表示开始的索引，不知道为啥每页不多不少刚好48

### 3.TODO

- 解决一下请求超时问题，除去Interval

- 递归换成`Promise`的循环