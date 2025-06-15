const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  pricePerDay: { type: Number, required: true, index: true },
  available: { type: Boolean, default: true, index: true },
  image: { type: String, required: false },
  transmission: { type: String, required: true }, // Automatic or Manual
  seats: { type: Number, required: true }, // Number of seats
  fuelType: { type: String, required: true }, // Gasoline, Diesel, Electric
  location: { type: String, required: true }, // Ensure location is required
  rating: { type: Number, required: false, default: 0 }, // Average rating of the car
  totalRatings: { type: Number, required: false, default: 0 }, // Total number of ratings
  trips: { type: Number, required: false, default: 0 }, // Number of trips
  discount: { type: Number, required: false, default: 0 }, // Discount percentage
  deliveryOption: { type: Boolean, required: false, default: false }, // Delivery option
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Car", carSchema);
