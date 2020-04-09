const express = require("express");
const fs = require("fs");
const app = express();
const https = require("https");
const cheerio = require("cheerio");
const rp = require("request-promise");
const Nightmare = require("nightmare"); // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: false }); // show:true  显示内置模拟浏览器

const baiduImageUrl =
  "https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=&sf=1&fmq=1586417271273_R&pv=&ic=&nc=1&z=&hd=&latest=&copyright=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&hs=2&sid=&word=%E6%80%A7%E6%84%9F%E6%B3%B3%E8%A3%85&f=3&oq=%E6%80%A7%E6%84%9F&rsp=0";

const downloadImages = (url, index) => {
  https
    .get(url, (res) => {
      res.setEncoding("binary");
      let imgdata = "";
      res.on("data", (data) => {
        imgdata += data;
      });
      res.on("end", () => {
        fs.writeFile(
          __dirname + "/images/" + index + ".jpg",
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
    .goto(baiduImageUrl)
    // .wait("div#imgid") //图片加载完成了与下面的一个wait等效
    // .wait(() => {
    //   return document.querySelector("div#imgid");
    // })
    // .wait(() => {
    // 取出100张图片，不然就模拟网页滚动加载
    //   const wapper = document.querySelector("html");
    //   if (document.querySelectorAll(".main_img").length > 100) {
    //     return true;
    //   } else {
    //     wapper.scrollTop = 100000;
    //     return false;
    //   }
    // })
    .scrollTo(100000, 0) //先滚动，下面的wait是判断图片数量够不够100张
    .wait(function () {
      const wapper = document.querySelector("html");
      if (document.querySelectorAll(".main_img").length > 100) {
        return true;
      } else {
        wapper.scrollTop = 100000;
        return false;
      }
    })
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
      imageList.each((index, ele) => {
        const url = $(ele).attr("data-imgurl");
        url && downloadImages(url, index);
      });
    })
    .catch((error) => {
      console.log(`百度图片 - ${error}`);
    });
};

loadPage();
