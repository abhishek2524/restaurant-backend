// Add restaurants
// Add food
// Update Order Status
const {
  getOrdersForRestaurants,
  dispatchOrderFun,
} = require("../orders/orderCtrl");
const Restaurant = require("./../../database/models/RestaurantModel");
const { getDriversByLocation, setDriverActive } = require("./../drivers/driversCtrl");
/* 
Data format : 
{
    "name": "Dhaba 2",
    "address" : "2066, 2063, 24th Main Rd, Vanganahalli, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102",
    "number" : "1234567897",
    "coord" : [3,5]
}
*/
exports.addRestaurant = async (req, res, next) => {
  try {
    let data = req.body;
    const restaurant = await Restaurant.create(data);
    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(409).json({ error: "Already Registered" });
    } else {
      res.status(500).json({ error: "Server Error" });
    }
  }
};

exports.restaurantLogin = async (req, res, next) => {
  try {
    const data = req.query;
    const phone = data.phone;
    const result = await Restaurant.findOne(
      { phone },
      { coord: 0, location: 0, __v: 0 }
    );
    if (result) {
      res
        .status(200)
        .json({ success: "ok", length: result.length, data: result });
    } else {
      res.status(401).json({ error: "User Does Not Exists" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// authenticate user before fetching
exports.getRestaurants = async (long, latt, distance = 1000) => {
  try {
    const data = await Restaurant.find(
      {
        location: {
          $near: {
            $maxDistance: distance,
            $geometry: {
              type: "Point",
              coordinates: [long, latt],
            },
          },
        },
      },
      { _id: 1, name: 1, address: 1, phone: 1 }
    );
    return data;
  } catch (error) {
    return null;
  }
};

exports.addFood = async (req, res) => {
  const data = req.body;
  const _id = data.res_id;
  const name = data.food_name;
  const price = data.price;
  const query = { _id };
  const updateDocument = {
    $push: { food: { name, price } },
  };
  const result = Restaurant.updateOne(
    query,
    updateDocument,
    function (err, doc) {
      if (err) res.status(500).json({ error: "Server Error" });
      if (doc.n) {
        return res
          .status(200)
          .json({ success: "ok", msg: "Sucessfully Added" });
      } else {
        return res
          .status(409)
          .json({
            error: "Either you have not registered or you need to login again.",
          });
      }
    }
  );
};

exports.getFood = async (_id) => {
  try {
    const data = await Restaurant.find({ _id }, { food: 1, name: 1, phone: 1 });
    return data;
  } catch (error) {
    return null;
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { res_id } = req.query;
    const orders = await getOrdersForRestaurants(res_id);
    return res
      .status(200)
      .json({ success: "ok", length: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getNearByDrivers = async (req, res) => {
  try {
    const { long, latt } = req.headers;
    console.log(long, latt);
    const data = await getDriversByLocation(long, latt);
    if (data && data.length) {
      return res.status(200).json({ success: "ok", length: data.length, data });
    }
    return res.status(409).json({ error: "No Drivers are available" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.dispatchOrder = async (req, res) => {
  try {
    const {order_id,res_id,food_id,user_id,driver_id} = req.body;
    const data = await dispatchOrderFun(order_id,res_id,food_id,user_id,driver_id);
    if(data){
      const isDriverActive = await setDriverActive(driver_id,false);
      if(isDriverActive) return res.status(200).json({success:"ok",msg:"Successfuly Dispatched."});
      return res.status(409).json({ error: "Could not dispatch" });
    }else{
      return res.status(409).json({ error: "Could not dispatch" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Server Error" });
  }
};
