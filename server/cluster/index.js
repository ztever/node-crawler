const cluster = require("cluster");
const cpuNums = require("os").cpus().length;
const fs = require("fs");
const formatJson = require("format-json-pretty");
cluster.setupMaster({
  exec: "./worker.js",
  args: ["--use", "http"]
});

console.log(`一共开启${cpuNums}个子进程来进行爬取`);
console.log("爬取数据是乱序的，因此给爬取的数据增加movieIndex字段\n");

let pageNum = 30;
const startTime = Date.now();
let totalData = [];

for (let i = 0; i < cpuNums; ++i) {
  let work = cluster.fork();

  // 抓取豆瓣前 10 页日本动画数据
  work.send([i, cpuNums, pageNum]);

  work.on("message", (msg) => {
    console.log(msg.msg);
    pageNum--;
    totalData.splice((msg.page - 1) * 20, 0, ...msg.res);
    if (pageNum === 0) {
      console.log(`\n已完成所有爬取， using ${Date.now() - startTime} ms\n`);
      try {
        // fs.writeFileSync("./data.json", JSON.stringify({ data: totalData }));
        fs.writeFileSync("./data.json", formatJson({ data: totalData }));
      } catch (error) {
        console.log("fs error");
      }
      console.log("接下来关闭各子进程:\n");

      cluster.disconnect();
    }
  });
}
cluster.on("fork", (worker) => {
  console.log(`[master] : fork worker ${worker.id}\n`);
});

cluster.on("exit", (worker) => {
  console.log(`[master] : 子进程 ${worker.id} 被关闭`);
});
