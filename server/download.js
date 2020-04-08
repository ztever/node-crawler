const express = require("express");
const fs = require("fs");
const app = express();
const https = require("https");
const cheerio = require("cheerio");
const rp = require("request-promise");
const Nightmare = require("nightmare"); // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: true }); // show:true  显示内置模拟浏览器
const downloadImages = (url) => {
  https
    .get(url, (res) => {
      res.setEncoding("binary");
      let imgdata = "";
      res.on("data", (data) => {
        imgdata += data;
      });
      const time = new Date().getTime();
      res.on("end", () => {
        fs.writeFile(
          __dirname + "/images/" + time + ".jpg",
          imgdata,
          "binary",
          (err) => {
            if (err) {
              console.log("err", err);
              return;
            }
          }
        );
      });
    })
    .on("error", (error) => {
      console.log("error", error);
    });
};

const loadPage = async () => {
  nightmare
    .goto(
      "https://image.baidu.com/search/index?ct=201326592&z=3&tn=baiduimage&ipn=r&word=美女比基尼&pn=0&istype=2&ie=utf-8&oe=utf-8&cl=2&lm=-1&st=-1&fr=&fmq=1586337792391_R&ic=&se=&sme=&width=0&height=0&face=0&hd=&latest=&copyright="
    )
    .wait("div#imgid") //图片加载完成了
    // .wait(() => {
    //   const wapper = document.querySelector("#wrapper");
    //   console.log("wapper", wapper);
    //   const top = wapper.scrollTop;
    //   console.log("top", top);
    //   // const imgLength = document.querySelectorAll(".main_img").length;
    //   // console.log("imgLength", imgLength);
    //   return true;
    // })
    // .scrollTo(10000, 0)
    // .wait(function () {
    //   console.log(
    //     "document.documentElement.scrollTop",
    //     document.documentElement.scrollTop
    //   );
    //   return true;
    // })
    .evaluate(() => document.querySelector("div#imgid").innerHTML)
    .end()
    .then((htmlStr) => {
      // fs.writeFile(__dirname + "html.html", htmlStr, (err) => {
      //   if (err) {
      //     console.log("err", err);
      //     return;
      //   }
      //   console.log("sucess");
      // });

      fs.writeFile(__dirname + "html.html", htmlStr, (err) => {
        if (err) {
          console.log("err", err);
          return;
        }
      });

      const $ = cheerio.load(htmlStr);
      const imageList = $(".main_img");
      console.log("imageList.length", imageList.length);
      imageList.each((index, ele) => {
        const url = $(ele).attr("data-imgurl");
        downloadImages(url);
      });
    })
    .catch((error) => {
      console.log(`百度图片 - ${error}`);
    });
};

loadPage();
