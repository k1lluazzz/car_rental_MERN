const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    userName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

rentalSchema.statics.isCarAvailable = async function (carId, startDate, endDate) {
    return !(await this.exists({
        car: carId,
        $or: [
            { startDate: { $lt: endDate }, endDate: { $gt: startDate } }, // Overlapping bookings
        ],
    }));
};

module.exports = mongoose.model('Rental', rentalSchema);
