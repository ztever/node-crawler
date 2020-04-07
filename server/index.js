const express = require("express");
const cheerio = require("cheerio");
const app = express();
const rp = require("request-promise");

const server = app.listen(3333, () => {
  // let host = server.address().address;
  let port = server.address().port;
  console.log("Your App is running at http://127.0.0.1:%s", port);
});

app.get("/", (req, res) => {
  rp("https://zhuanlan.zhihu.com/p/126476910")
    .then(function (htmlString) {
      // Process html...
      // const $ = cheerio.load("<div>11111<div>");
      // const div = $("div");
      res.send(htmlString);
    })
    .catch(function (err) {
      // Crawling failed...
      console.log("error", err);
    });
});
