const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cors = require('cors');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://ark2281:KYTDfOurDnE0grzO@mean-course.x6a6f4i.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection failed!');
});


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));   //for showing images on the frontend


app.use((req, res, next) => {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
);
res.setHeader("Access-Control-Allow-Methods",
"GET, POST, PATCH, PUT, DELETE, OPTIONS"
);
next();
});


app.use(cors())

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
