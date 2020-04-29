# node-crawler

nodejs 写的 crawler 爬虫

## 安装依赖

yarn install

### 相关的依赖

cheerio 服务端精简的 juqery
request 服务端的 ajax 也可以用 superagent
nightmare 模拟浏览器环境访问页面，使 js 运行，生成动态页面再抓取,针对异步加载的模块
nodemon node 的热更新

#### 运行

yarn start 是启动 server 下面的 index

node server/test 启动 test 服务

node server/download 下载百度图片

node server/getdata/home 爬取 jd 商城 home 页的数据，并写入到数据库中，需要链接数据库
