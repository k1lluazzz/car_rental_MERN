const Car = require('../models/Car');
const User = require('../models/User');
const Rental = require('../models/Rental');
const Payment = require('../models/Payment');

const getSystemStats = async (req, res) => {
    try {
        const totalCars = await Car.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRentals = await Rental.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            totalCars,
            totalUsers,
            totalRentals,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMonthlyRevenue = async (req, res) => {
    try {
        const monthlyRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            {
                $lookup: {
                    from: 'rentals',
                    localField: 'rentalId',
                    foreignField: '_id',
                    as: 'rental'
                }
            },
            { $unwind: '$rental' },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'rental.car',
                    foreignField: '_id',
                    as: 'car'
                }
            },
            { $unwind: '$car' },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    revenue: { $sum: '$rental.totalPrice' },
                    originalRevenue: { $sum: '$rental.originalPrice' },
                    discountTotal: { 
                        $sum: { 
                            $subtract: ['$rental.originalPrice', '$rental.totalPrice'] 
                        }
                    },
                    totalRentals: { $sum: 1 },
                    carTypes: { 
                        $addToSet: {
                            carName: '$car.name',
                            brand: '$car.brand'
                        }
                    },
                    averageRentalDuration: { $avg: '$rental.durationInDays' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const formattedData = monthlyRevenue.map(item => ({
            month: `${item._id.month}/${item._id.year}`,
            revenue: item.revenue,
            originalRevenue: item.originalRevenue,
            discountTotal: item.discountTotal,
            totalRentals: item.totalRentals,
            carTypes: item.carTypes,
            averageRentalDuration: Math.round(item.averageRentalDuration * 10) / 10
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error in getMonthlyRevenue:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSystemStats,
    getMonthlyRevenue
};
