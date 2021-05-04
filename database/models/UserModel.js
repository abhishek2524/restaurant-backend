const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere", //to get nearby location using $near
    },
  },
  phone: {
      type: String,
      unique: [true,'Already Exists!'],
      required: [true,'Phone number is required'],
      maxLength : [10,'Please enter 10 digit number']
  },
  coord:[]
});

userSchema.pre('save',function(next){
    this.location.coordinates = this.coord;
    this.coord = undefined;
    next(); 
});

const User = mongoose.model('User',userSchema);

module.exports = User