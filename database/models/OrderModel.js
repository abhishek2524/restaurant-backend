const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'User id is required'],
        ref: 'User'
    },
    res_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'Res id is required'],
        ref: 'Restaurant'
    },
    food_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'Res id is required'],
        ref: 'Restaurant.food'
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    order_start_time: {
        type: Date,
        default: Date.now()
    },
    order_dispatch_time: {
        type: Date
    },
    order_end_time: {
        type: Date
    },
    order_status: {
        type: String,
        enum: ['Ordered','Dispatched','Delivered','Canceled'],
        default: 'Ordered'
    }
});

const Order = mongoose.model('Order',orderSchema);
module.exports = Order;