const express = require("express");
const app = express();
const port = 8080;
const usersRouter = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", [usersRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 켜졌어요!");
})