const Order = require('./../../database/models/OrderModel');
// const mongoose = require('mongoose');
// ObjectId = mongoose.Types.ObjectId;
exports.addOrder = async (res_id,food_id,user_id)=>{
    try{
        const data = await Order.create({res_id,food_id,user_id});
        return data;
    }catch(error){
        return null;
    }
};

exports.getOrdersForRestaurants = async (res_id)=>{
    // res_id = ObjectId(res_id);
    try{
        const orders = await Order.find({res_id,order_status:'Ordered'});
        return orders;
    }catch(err){    
        return err;
    }
}

exports.dispatchOrderFun = async (order_id,res_id,food_id,user_id,driver_id)=>{
    try{
        const qry = {_id:order_id,res_id,food_id,user_id};
        const updateData = {driver_id,order_dispatch_time: Date.now(),order_status:"Dispatched"};
        const data = await Order.findOneAndUpdate(qry,updateData);
        return data;
    }catch(err){
        console.log(err);
        return null;
    }
}

exports.getDriversOrder = async (driver_id)=>{
    try{
        const data = await Order.find({driver_id});
        return data;
    }catch(err){
        return null;
    }
}

exports.updateDeliveryStatus = async (order_id,status)=>{
    try{
        const qry = {_id:order_id};
        const statusObj = {1:"Delivered",0:"Canceled"};
        const updateData = {order_end_time: Date.now(),order_status:statusObj[status]};
        const data = await Order.findOneAndUpdate(qry,updateData);
        return data;
    }catch(err){
        console.log(err);
        return null;
    }
}

exports.getAllOrderForUser = async (req,res)=>{
    try{
        const {user_id} = req.headers;
        const data = await Order.find({user_id}).sort({order_start_time:-1});
        if(data && data.length){
            return res.status(200).json({success:"ok",length:data.length,data});
        }
        res.status(409).json({error:"No Order Found."});
    }catch(err){
        res.status(500).json({error:"Server Error."});
    }
}

exports.getOrderById = async (req,res)=>{
    try{
        const {_id} = req.params;
        const {user_id} = req.headers;
        const data = await Order.find({_id}).sort({order_start_time:-1});
        if(data && data.length){
            return res.status(200).json({success:"ok",length:data.length,data});
        }
        res.status(409).json({error:"No Order Found."});
    }catch(err){
        res.status(500).json({error:"Server Error."});
    }
}