const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const user = require('./routes/userRoute')
const food = require('./routes/dite')
var dotenv = require("dotenv");

var app = express();

app.use(express.json({ extended: true, limit: "5mb" }));
const port = 3000;

mongoose.connect('mongodb://localhost/diteapp');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

dotenv.config();
app.use("/user", user);
app.use("/food", food);

const server = http.createServer(app);

server.listen(port, () => {
    console.log("Server is up and running on port number " + port);
});