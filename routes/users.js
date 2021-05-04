const express = require('express');
const { getDriverLocation } = require('../controller/drivers/driversCtrl');
const { getAllOrderForUser, getOrderById } = require('../controller/orders/orderCtrl');
const { addUser, getUserData, getNearByRestaurants, getFoodBasedOnRestaurant, orderFood, updateLocation} = require('../controller/users/userCtrl');
const routes = express.Router();

routes.route('/').get(getUserData).post(addUser);
routes.route('/hotels').get(getNearByRestaurants);
routes.route('/food').get(getFoodBasedOnRestaurant);
routes.route('/location').put(updateLocation);
routes.route('/order').post(orderFood).get(getAllOrderForUser);
routes.route('/order/:_id').get(getOrderById);
routes.route('/driver-location').get(getDriverLocation);

module.exports = routes;