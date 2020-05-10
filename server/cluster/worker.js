const spider = require("./spider");

process.on("message", async (params) => {
  let num = 0;
  const pageNum = 20;
  const totalPage = params[2];
  const cpuNum = params[1];
  const cpuIndex = params[0];
  const maxPageStart = totalPage * 20 - 1;
  while (pageNum * (num + cpuIndex) <= maxPageStart) {
    let pageStart = pageNum * (num + cpuIndex);
    (async () => {
      const res = await spider(pageStart);
      process.send({
        msg: `子进程 ${process.pid} 成功爬取日本动画第${
          (pageStart + 20) / 20
        }页数据`,
        res,
        page: (pageStart + 20) / 20
      });
    })();
    num += cpuNum;
  }
});
