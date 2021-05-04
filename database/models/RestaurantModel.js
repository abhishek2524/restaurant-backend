const mongoose = require("mongoose");
// const geocoder = require('./../../utils/geocoders');//for getting coordinates based on address
const foodSchema = new mongoose.Schema({
  name:String,
  price: Number
})

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Restaurant should enter Phone number"],
    maxLength: [10, "Restaurant Phone Number must be 10 digits"],
  },
  address: {
    type: String,
    required: [true, "Please give restaurant address"],
  },
  coord: [Number],
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      default: "Point", // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  food: [foodSchema]
});
RestaurantSchema.index({ location: "2dsphere" });

RestaurantSchema.pre("save", async function (next) {
  /* 
    //for getting coordinates using location
    const loc = await geocoder.geocode({
      address: this.address
    }); 
    this.location.coordinates = //assign value form variable 'loc'
  */
  this.location.coordinates = this.coord;
  this.coord = undefined;
  next();
});


module.exports = mongoose.model("Restaurant", RestaurantSchema);
