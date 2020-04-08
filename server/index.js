const express = require("express");
const cheerio = require("cheerio");
const app = express();
const rp = require("request-promise"); //可以用superagent
// const fs = require("fs");

const server = app.listen(3333, () => {
  // let host = server.address().address;
  let port = server.address().port;
  console.log("Your App is running at http://127.0.0.1:%s", port);
});

app.get("/", async (req, res) => {
  // rp("http://news.baidu.com/")
  //   .then(function (htmlString) {
  //     // Process html...
  //     const $ = cheerio.load(htmlString);
  //     const hotnews = $(".hotnews");
  //     const map = {};
  //     hotnews.find("b").each((index, element) => {
  //       map[index] = $(element).text();
  //     });
  //     // fs.writeFile(__dirname + "/test.json", JSON.stringify(map), (err) => {
  //     //   if (err) {
  //     //     console.log("err", err);
  //     //     return;
  //     //   }
  //     //   console.log("sucess");
  //     // });
  //     res.send(JSON.stringify(map));
  //   })
  //   .catch(function (err) {
  //     // Crawling failed...
  //     console.log("error", err);
  //   });

  const options = {
    uri: "http://news.baidu.com/",
    transform: (body) => cheerio.load(body),
  };

  const $ = await rp(options);
  const hotnews = $(".hotnews");
  const map = {};
  hotnews.find("b").each((index, element) => {
    map[index] = $(element).text();
  });
  res.send(JSON.stringify(map));
});
