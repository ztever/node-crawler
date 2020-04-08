// Electron可以让你使用纯JavaScript调用Chrome丰富的原生的接口来创造桌面应用。你可以把它看作一个专注于桌面应用的Node.js的变体，
// 而不是Web服务器。其基于浏览器的应用方式可以极方便的做各种响应式的交互Nightmare是一个基于Electron的框架，
// 针对Web自动化测试和爬虫，因为其具有跟PlantomJS一样的自动化测试的功能可以在页面上模拟用户的行为触发一些异步数据加载，
// 也可以跟Request库一样直接访问URL来抓取数据，并且可以设置页面的延迟时间，所以无论是手动触发脚本还是行为触发脚本都是轻而易举的。

const express = require("express");
const cheerio = require("cheerio");
const app = express();
const Nightmare = require("nightmare"); // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: true }); // show:true  显示内置模拟浏览器

const server = app.listen(3333, () => {
  // let host = server.address().address;
  let port = server.address().port;
  console.log("Your App is running at http://127.0.0.1:%s", port);
});

app.get("/", (req, res) => {
  /**
   * [description] - 抓取本地新闻页面
   * [nremark] - 百度本地新闻在访问页面后加载js定位IP位置后获取对应新闻，
   * 所以抓取本地新闻需要使用 nightmare 一类的自动化测试工具，
   * 模拟浏览器环境访问页面，使js运行，生成动态页面再抓取
   */
  // 抓取本地新闻页面
  nightmare
    .goto("http://news.baidu.com/")
    .wait("div#local_news")
    .evaluate(() => document.querySelector("div#local_news").innerHTML)
    .then((htmlStr) => {
      // 获取本地新闻数据
      res.send(htmlStr);
    })
    .catch((error) => {
      console.log(`本地新闻抓取失败 - ${error}`);
    });
});
