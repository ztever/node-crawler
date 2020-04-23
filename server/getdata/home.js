const https = require("https");
const cheerio = require("cheerio");
const Nightmare = require("nightmare"); // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: true }); // show:true  显示内置模拟浏览器
const db = require("./db");
const requestUrl = "https://m.jd.com/";

const loadPage = () => {
  nightmare
    .goto(requestUrl)
    // .wait(".j_slide_list")
    .wait(() => {
      content = document.querySelectorAll("#recFloor ul li");
      const wapper = document.querySelector("html");
      if (content && content.length > 50) {
        return true;
      } else {
        wapper.scrollTop = 1000000;
        return false;
      }
    })
    .evaluate(() => document.querySelector("html").innerHTML)
    // .end()
    .then((htmlStr) => {
      const $ = cheerio.load(htmlStr);
      getHomeBannerData($);
      getHomeServerList($);
      getHomeRecommend($);
      getRecommendForYou($);
    })
    .catch((error) => {
      console.log(`request - ${error}`);
    });
};
//获取home页 banner数据
const getHomeBannerData = async ($) => {
  const banner = $(".j_slide_list li img");
  await db("truncate table home_banner"); //清除table
  banner.each((index, element) => {
    const src =
      "https:" + ($(element).attr("init_src") || $(element).attr("src"));
    const sql = `insert home_banner (src) values ('${src}')`;
    db(sql);
  });
};

// 获取home页 入口的数据
const getHomeServerList = async ($) => {
  const imageList = $(".position-ab img");
  const textList = $(".position-ab span");
  await db("truncate table home_server_list"); //清除table
  imageList.each((index, element) => {
    const icon = "https:" + $(element).attr("src");
    const name = $(textList[index]).text();
    const sql = `insert home_server_list (icon,name) values ('${icon}','${name}')`;
    db(sql);
  });
};
// 获取推荐
const getHomeRecommend = async ($) => {
  const content = $(".floor-the-container .floor-container");
  await db("truncate table home_recommend"); //清除tables
  content.each(async (index, element) => {
    const floor = $(element).find(".graphic-separation");
    floor.each((index2, ele) => {
      const eles = $(ele);
      const title = eles.find(".graphic-tit").text();
      const spec = eles.find(".graphic-wz").text().trim();
      let imgSrc = "";
      eles.find("img").each((index3, imgEle) => {
        const src = $(imgEle).attr("init_src") || $(imgEle).attr("src");
        imgSrc += "https:" + src + ",";
      });
      imgSrc = imgSrc.slice(0, imgSrc.length - 1);
      if (spec) {
        const sql = `insert home_recommend (title,spec,src) values ('${title}','${spec}','${imgSrc}')`;
        db(sql);
      }
    });
  });
};
// 为你推荐
const getRecommendForYou = async ($) => {
  const content = $("#recFloor ul li");
  await db("truncate table recommend_for_you"); //清除tables
  content.each((index, element) => {
    const ele = $(element);
    const title = ele.find(".similar-product-text").text().trim();
    let jd_market = ele.find(".similar-product-text img").attr("init_src");
    jd_market = jd_market ? "https:" + jd_market : "";
    const src = "https:" + ele.find(".similar-posre img").attr("src");
    const price =
      ele.find(".similar-product-price .big-price").text().trim() +
      ele.find(".similar-product-price .small-price").text().trim();
    const tags = ele.find(".rec-price-tag")
      ? ele.find(".rec-price-tag").text().trim()
      : "";
    const jump_href = "https:" + $(".j_see_similar").attr("jump-href");
    const sql = `insert recommend_for_you (title,jd_market,src,price,tags,jump_href) values ('${title}','${jd_market}','${src}','${price}','${tags}','${jump_href}')`;
    db(sql);
  });
};

loadPage();
