const Driver = require("../../database/models/DriverModel");
const { getDriversOrder,updateDeliveryStatus } = require("../orders/orderCtrl");

exports.addDriver = async (req,res)=>{
    try{
        const data = req.body;
        const result = await Driver.create(data);
        console.log(result);
        return res.status(200).json({success:"ok",msg:"Registered Successfuly."})
    }catch(err){
        if(err.code === 11000){
            return res.status(409).json({error:"Already Registered."})
        }
        return res.status(500).json({error:"Server Error"})
    }
}

exports.getDriversByLocation = async (long,latt,distance=1000)=>{
    console.log('13434345')
    try{
    const data = await Driver.find(
        {
        active: true,
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
        { _id: 1, name: 1, phone: 1,"location":1 }
      );
      return data;
    }catch(err){
        return err;
    }
}

exports.setDriverActive = async (_id,active)=>{
  try{
    const data = await Driver.findOneAndUpdate({_id},{active});
    return true;
  }catch(err){
    return false;
  }
}

exports.getDeliveryOrders = async (req,res)=>{
  try{
    const {driver_id} = req.query;
    const data = await getDriversOrder(driver_id);
    if(data && data.length) return res.status(200).json({success:"ok",length:data.length,data});
    return res.status(409).json({error:"No Food Order To Deliver"});
  }catch(err){
    return res.status(500).json({error:"Server Error"});
  }
}

exports.updateDelivery = async (req,res)=>{
  try{
    const {order_id,status,driver_id} = req.body;
    const deliveryUpdate = await updateDeliveryStatus(order_id,status);
    const driverStatus = await await Driver.findOneAndUpdate({_id:driver_id},{active:true});
    if(deliveryUpdate && driverStatus){
      return res.status(200).json({success:"ok",msg:"Successfully Updated"});
    }
    return res.status(409).json({error:"Error while Updating"});
  }catch(err){
    console.log(err)
    return res.status(500).json({error:"Server Error"});
  }
}

exports.updateDriverLocation = async (req,res)=>{
  try{
    const {driver_id,coordinates} = req.body;
    const data = await Driver.findOneAndUpdate({_id:driver_id},{"location.coordinates" : coordinates});
    if(data){
      return res.status(200).json({success:"ok",msg:"Location updated."});
    }
    return res.status(401).json({error:"Error while updating location."})
  }catch(error){
    console.log(error);
    return res.status(500).json({error:"Server Error"})
  }
}

exports.getDriverLocation = async (req,res)=>{
  try{
    const {driver_id} = req.query;
    const data = await Driver.findOne({_id:driver_id});
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