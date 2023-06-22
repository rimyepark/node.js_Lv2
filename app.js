const express = require('express');
const app = express();
const port = 3000;

const cookieParser = require("cookie-parser");
const myhomepageRouter = require("./routes/myhomepage.js");
const mycommentRouter = require("./routes/mycomment.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const connect = require("./schemas");
connect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api",[myhomepageRouter, mycommentRouter, usersRouter, authRouter]);


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});