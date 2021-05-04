const User = require("../../database/models/userModel");
const { addOrder } = require("../orders/orderCtrl");
const { getRestaurants, getFood } = require("../reastaurants/restaurantsCtrl");

exports.addUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await User.create(data);
    res.status(200).json({ success: "Ok", code: 200, data: result });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Already Registered" });
    } else {
      res.status(500).json({ error: "Server Error" });
    }
  }
};

/* Params : {phone:''} */
exports.getUserData = async (req, res) => {
  try {
    const data = req.query;
    const phone = data.phone;
    const result = await User.findOne({ phone }, { name: 1, phone: 1 });
    if (result) {
      res
        .status(200)
        .json({ success: "ok", length: result.length, data: result });
    } else {
      res.status(401).json({ error: "User Does Not Exists" });
    }
    //     User.find(data, function (err, user) {
    //         console.log(err);
    //         console.log(user);
    //    });
    //     res.status(401).json({error:"User Does Not Exists"})
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getNearByRestaurants = async (req, res, next) => {
  try {
    const headers = req.headers;
    const { latt, long } = headers;
    const { userid } = req.query;
    const data = await getRestaurants(long, latt);
    console.log(data);
    if (data.length) {
      res.status(200).json({ success: "ok", length: data.length, data: data });
    } else {
      res.status(409).json({ error: "No near by restaurants." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getFoodBasedOnRestaurant = async (req, res) => {
  try {
    const { user_id, res_id } = req.query;
    const data = await getFood(res_id);
    if (data && data.length) {
      res.status(200).json({ success: "ok", length: data.length, data });
    } else {
      res.status(409).json({error: "No Data"});
    }
  } catch (err) {
    res.status(500).json({error: "Server Error"});
  }
};

exports.orderFood = async (req,res)=>{
  try{
    const {res_id,food_id,user_id} = req.body;
    const auth = await authenticateUser(user_id);
    if(auth){
      const order = addOrder(res_id,food_id,user_id);
      if(order){
        return res.status(200).json({success:"ok",msg:"Order Placed Successfully."});
      }
      return res.status(500).json({error:"Error while placing order."})
    }else{
      return res.status(500).json({error:"You need to be logged in first to order."})
    } 
  }catch(error){
    return res.status(500).json({error:"Server Error"})
  }
}

const authenticateUser = async (_id)=>{
  try{
    const data = await User.findOne({_id});
    if(data === null){
      return false
    }
    return true;
  }catch(error){
    return false
  }
}

exports.updateLocation = async (req,res)=>{
  try{
    const {user_id,coordinates} = req.body;
    const data = await User.findOneAndUpdate({_id:user_id},{"location.coordinates" : coordinates});
    if(data){
      return res.status(200).json({success:"ok",msg:"Location updated."});
    }
    return res.status(401).json({error:"Error while updating location."})
  }catch(error){
    console.log(error);
    return res.status(500).json({error:"Server Error"})
  }
}

exports.getUserLocation = async (req,res)=>{
  try{
    const {user_id} = req.query;
    const data = await User.findOne({_id:user_id});
    console.log(data)
    if(data){
      return res.status(200).json({success:"ok",length:data.length,data});
    }
    return res.status(401).json({error:"Error while updating location."})
  }catch(error){
    console.log(error);
    return res.status(500).json({error:"Server Error"})
  }
}