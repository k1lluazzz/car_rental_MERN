const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    car: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car', 
        required: true 
    },
    userName: { 
        type: String, 
        required: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    totalAmount: { 
        type: Number,
        required: true 
    },
    durationInDays: { 
        type: Number,
        required: true 
    },    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'unpaid', 'returned'],
        default: 'pending'
    },
    review: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxlength: 500
        },
        createdAt: {
            type: Date
        }
    },
    returnDetails: {
        returnDate: {
            type: Date
        },
        condition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
        },
        notes: {
            type: String
        }
    }
}, {
    timestamps: true
});

rentalSchema.statics.isCarAvailable = async function (carId, startDate, endDate) {
    return !(await this.exists({
        car: carId,
        status: { $ne: 'cancelled' },
        $or: [
            { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
        ],
    }));
};

rentalSchema.pre('validate', async function(next) {
    try {
        const Car = mongoose.model('Car');
        const car = await Car.findById(this.car);
        
        if (!car) {
            throw new Error('Car not found');
        }

        const startDateTime = new Date(this.startDate);
        const endDateTime = new Date(this.endDate);
        const durationMs = endDateTime.getTime() - startDateTime.getTime();
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
        
        if (durationDays < 1) {
            throw new Error('Rental duration must be at least 1 day');
        }

        this.durationInDays = durationDays;
        this.totalAmount = car.pricePerDay * durationDays;
    } catch (error) {
        return next(error);
    }

    next();
});

module.exports = mongoose.model('Rental', rentalSchema);
