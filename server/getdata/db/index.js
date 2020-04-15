const mysql = require("mysql");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "zt123456",
  database: "mall",
});
db.connect();

module.exports = (sql, callback) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, data) => {
      if (err) reject(err);
      // 去掉RowDataPacket
      else resolve(JSON.parse(JSON.stringify(data)));
    });
  });
};
