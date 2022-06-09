const express = require("express");
const app = express();
const PORT = 8000;

// 정적 파일 불러오기
// app.use(express.static(__dirname + "../public"));
app.use('/', express.static("../public"));

// 라우팅 정의
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Listen : ${PORT}`);
});