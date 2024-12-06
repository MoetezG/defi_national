const express = require("express");
const app = express();
const cors = require("cors");
const articleRouter = require("./routes/article");
const quizRouter = require("./routes/quiz");
const loginRouter = require("./routes/login");
const dbConnection = require("./db/dbconnection");

dbConnection();

app.use(cors());
app.use(express.json());

app.use("/article", articleRouter);
app.use("/quiz", quizRouter);
app.use("/user", loginRouter);

app.listen(8080, "0.0.0.0", () => {
  console.log("Server is running on Port:8080");
});
