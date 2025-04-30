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
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const formattedData = monthlyRevenue.map(item => ({
            month: `${item._id.month}/${item._id.year}`,
            revenue: item.revenue
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSystemStats,
    getMonthlyRevenue
};
