const https = require("https");

const fs = require("fs");
const cheerio = require("cheerio");

https.get("https://www.baidu.com/", function (res) {
  // 设置编码
  res.setEncoding("utf8");

  // 当接收到数据时，会触发 "data" 事件的执行
  let html = "";
  res.on("data", function (data) {
    html += data;
  });
  // 数据接收完毕，会触发 "end" 事件的执行
  res.on("end", async function () {
    // 待保存到文件中的字符串
    let fileData = "";
    // 调用 cheerio.load() 方法，生成一个类似于 jQuery 的对象
    const $ = cheerio.load(html);
    // 接下来像使用 jQuery 一样来使用 cheerio
    $("body").each(function (index, element) {
      const el = $(element);
      fileData += `${index} is ${el.html()}`;
    });
    try {
      await fs.readdirSync(__dirname + "/source.txt"); //也可以用fs.existsSync判断文件和文件夹是否存在
      fs.writeFile(__dirname + "/source.txt", fileData, (err) => {
        if (err) {
          console.log("err", err);
          return;
        }
        console.log("sucess");
      });
    } catch (error) {
      // await fs.writeFileSync(__dirname + "/source.txt");
      fs.writeFile(__dirname + "/source.txt", fileData, (err) => {
        if (err) {
          console.log("err", err);
          return;
        }
        console.log("sucess");
      });
    }
  });
});
