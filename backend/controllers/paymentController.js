const Payment = require("../models/Payment");
const Rental = require("../models/Rental");
const Car = require("../models/Car");

const getRentalPaymentDetails = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.rentalId)
      .populate("car")
      .populate("userId");

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const existingPayments = await Payment.find({
      rentalId: rental._id,
      status: "completed",
    });

    const depositPayment = existingPayments.find(
      (p) => p.paymentType === "deposit"
    );
    const fullPayment = existingPayments.find((p) => p.paymentType === "full");

    if (fullPayment) {
      return res.status(400).json({
        message: "Full payment already completed",
        payment: fullPayment,
      });
    }

    let paymentDetails = {
      rental,
      totalAmount: rental.totalAmount,
      duration: rental.durationInDays,
      car: rental.car,
      user: rental.userId,
      paymentStatus: rental.status,
    };

    if (depositPayment) {
      paymentDetails.depositPaid = true;
      paymentDetails.depositAmount = depositPayment.amount;
      paymentDetails.remainingAmount = depositPayment.remainingAmount;
    }

    res.json(paymentDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const rental = await Rental.findById(payment.rentalId)
      .populate("car")
      .populate("userId");

    if (!rental) {
      return res.status(404).json({ message: "Rental information not found" });
    }

    const response = {
      ...payment.toObject(),
      rental,
      userEmail: rental.userId?.email,
      remainingBalance:
        payment.paymentType === "deposit" ? payment.remainingAmount : 0,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting payment status:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRentalPaymentDetails,
  getPaymentStatus,
};
