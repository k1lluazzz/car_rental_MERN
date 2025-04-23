const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true }, // Changed from availability to available
    image: { type: String, required: false }, // URL of the car image
    
});

module.exports = mongoose.model('Car', carSchema);
