const express = require('express');
const route = express.Router();
const userControler = require("../controllers/userController")

route.post('/create', userControler.registerUser);

module.exports = route;