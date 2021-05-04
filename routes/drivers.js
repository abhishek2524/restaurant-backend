const express = require('express');
const { addDriver, getDeliveryOrders, updateDelivery, updateDriverLocation } = require('../controller/drivers/driversCtrl');
const { getUserLocation } = require('../controller/users/userCtrl');
const routes = express.Router();

routes.route('/').post(addDriver).get(getDeliveryOrders);
routes.route('/delivery').put(updateDelivery);
routes.route('/location').put(updateDriverLocation);
routes.route('/user-location').get(getUserLocation);
// routes.route('/restaurant-location').get(getRestaurantLocation);

module.exports = routes;