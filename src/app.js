require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("./config/mongo");
const router = require("./routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.get("/", (request, response) => {
  response.send("habla menor");
});

dbConnect();

// routes
app.use("/api", router);

app.listen(port, () => {
  console.log(`the server is running 🏃🏾‍♂️🏃🏾‍♂️🏃🏾‍♂️🏃🏾‍♂️ at http://localhost:${port}`);
});
