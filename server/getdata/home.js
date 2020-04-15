const https = require("https");
const cheerio = require("cheerio");
const Nightmare = require("nightmare"); // 自动化测试包，处理动态页面
const nightmare = Nightmare({ show: false }); // show:true  显示内置模拟浏览器
const db = require("./db");
const requestUrl = "https://m.jd.com/";

const loadPage = () => {
  nightmare
    .goto(requestUrl)
    .wait(".j_slide_list")
    .evaluate(() => document.querySelector("html").innerHTML)
    .end()
    .then((htmlStr) => {
      const $ = cheerio.load(htmlStr);
      getHomeBannerData($);
      getHomeServerList($);
      getHomeRecommend($)
      // process.exit();
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
const getHomeRecommend = async ($)=>{
  const content = $(".floor-the-container .floor-container");
  await db("truncate table home_recommend"); //清除tables
  content.each(async(index,element)=>{
    const floor = $(element).find('.graphic-separation');
   
    floor.each((index2,ele)=>{
      const eles = $(ele);
      const title = eles.find('.graphic-tit').text();
      const spec = eles.find('.graphic-wz').text();
console.log('spec',eles.find('.graphic-wz'))
      let imgSrc = "";
      eles.find('img').each((index3,imgEle)=>{
        const src = $(imgEle).attr('init_src') || $(imgEle).attr('src');
        imgSrc += 'https:'+src+','; 
      })
      imgSrc = imgSrc.slice(0,imgSrc.length-1);
      const sql = `insert home_recommend (title,spec,src) values ('${title}','${spec}','${imgSrc}')`;
       db(sql)
    })
  })

  

}

loadPage();
