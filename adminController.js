const Order = require('../models/Order');
const Reservation = require('../models/Reservation');

const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);

    const dailyOrders = await Order.find({ createdAt: { $gte: today } }).countDocuments();
    const dailyReservations = await Reservation.find({ date: { $gte: today } }).countDocuments();
    const totalSales = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);

    res.json({
      dailyOrders,
      dailyReservations,
      totalSales: totalSales[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};

module.exports = { getDashboardOverview };
