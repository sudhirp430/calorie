const express = require('express');
const { basicAuth } = require('../utils/auth')
const route = express.Router();
const foodControler = require("../controllers/foodController")
const adminRole = require("../utils/userRoleVerify");

route.post('/add', basicAuth, foodControler.addFood);
route.get('/list', basicAuth, foodControler.listFoodForUser);
route.get('/calorie', basicAuth, foodControler.totalFoodCalorisForUser);
route.get('/threshold', basicAuth, foodControler.thresholdCrosedDaysForUser);
route.get('/admin/list', basicAuth, adminRole.verifyAdminRole, foodControler.listFoodForAdmin);
route.put('/update', basicAuth, adminRole.verifyAdminRole, foodControler.update)
route.delete('/delete', basicAuth, adminRole.verifyAdminRole, foodControler.delete)
route.get('/report', basicAuth, adminRole.verifyAdminRole, foodControler.report)


module.exports = route;