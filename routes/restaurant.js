const express = require('express');
const { addRestaurant, restaurantLogin, addFood, getOrders, getNearByDrivers,dispatchOrder} = require('../controller/reastaurants/restaurantsCtrl');
const routes = express.Router();

// routes.get('/',(req,res,next)=>{
//     addRestaurant(req,res,next);
// })

routes.route('/').get(restaurantLogin).post(addRestaurant);
routes.route('/food').post(addFood);
routes.route('/orders').get(getOrders).put(dispatchOrder);
routes.route('/drivers').get(getNearByDrivers);

module.exports = routes;