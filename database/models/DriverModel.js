const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      default: "Point", // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    },
  },
  coord: [],
  phone: {
    type: String,
    unique: [true, "Driver number must be unique "],
    required: true,
    maxLength: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active:{
    type: Boolean,
    default: true
  }
});

driverSchema.index({ location: "2dsphere" });

driverSchema.pre("save", function (next) {
  this.location.coordinates = this.coord;
  this.coord = undefined;
  next();
});

const Driver = mongoose.model("Driver", driverSchema);
module.exports = Driver;
