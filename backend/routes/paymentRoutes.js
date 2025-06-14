const express = require("express");
const router = express.Router();
const moment = require("moment");
const Payment = require("../models/Payment");
const Rental = require("../models/Rental");
const vnpayService = require("../services/vnpayService");
const emailService = require("../services/emailService");
const {
  getRentalPaymentDetails,
  getPaymentStatus,
} = require("../controllers/paymentController");

// Add new route for getting rental payment details
router.get("/rental/:rentalId", getRentalPaymentDetails);

// Add new route for checking payment status
router.get("/status/:orderId", getPaymentStatus);

router.post("/create_payment_url", async (req, res) => {
  const { rentalId, amount, paymentType } = req.body;
  try {
    // Get IP address
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const orderId = `${moment().format("HHmmss")}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Get rental to calculate deposit amounts if needed
    const rental = await Rental.findById(rentalId).populate("car");
    if (!rental) {
      throw new Error("Rental not found");
    }

    let paymentAmount = amount;
    let remainingAmount = 0;

    if (paymentType === "deposit") {
      const depositPercentage = 30; // 30% deposit
      paymentAmount = Math.ceil(rental.totalAmount * (depositPercentage / 100));
      remainingAmount = rental.totalAmount - paymentAmount;
    }

    const payment = new Payment({
      orderId,
      rentalId,
      amount: paymentAmount,
      paymentMethod: "vnpay",
      paymentType,
      depositPercentage: paymentType === "deposit" ? 30 : null,
      remainingAmount: paymentType === "deposit" ? remainingAmount : null,
    });
    await payment.save();

    const isRemainingPayment = paymentType === "remaining";
    const orderInfo = isRemainingPayment
      ? `Thanh toan so tien con lai cho thue xe ${rental.car.name} - ${orderId}`
      : `Thanh toan ${
          paymentType === "deposit" ? "dat coc" : "toan bo"
        } thue xe ${rental.car.name} - ${orderId}`;

    const paymentUrl = vnpayService.createPaymentUrl(
      orderId,
      paymentAmount,
      orderInfo,
      ipAddr
    );

    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/vnpay_return", async (req, res) => {
  try {
    const vnpParams = req.query;
    const isValidSignature = vnpayService.verifyReturnUrl(vnpParams);

    if (!isValidSignature) {
      throw new Error("Invalid signature");
    }

    const orderId = vnpParams["vnp_TxnRef"];
    const responseCode = vnpParams["vnp_ResponseCode"];

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.status = responseCode === "00" ? "completed" : "failed";
    payment.responseCode = responseCode;
    payment.transactionRef = vnpParams["vnp_TransactionNo"];
    payment.bankCode = vnpParams["vnp_BankCode"];
    payment.paymentDate = new Date();
    await payment.save();

    // Update rental status and send email if payment is successful
    if (responseCode === "00") {
      try {
        const rental = await Rental.findById(payment.rentalId)
          .populate("car")
          .populate("userId");

        if (!rental) {
          throw new Error("Rental not found");
        }

        // Update rental status based on payment type
        if (payment.paymentType === "deposit") {
          rental.status = "deposit_paid";
        } else {
          rental.status = "completed";
        }
        await rental.save(); // Send email for deposit and full payments, but not for remaining payments
        if (
          payment.paymentType === "deposit" ||
          payment.paymentType === "full"
        ) {
          const emailSent = await emailService.sendInvoiceEmail(
            rental.userId.email,
            rental,
            payment
          );
          if (!emailSent) {
            console.warn(
              `Failed to send invoice email for order ${orderId}. Payment was successful, but email delivery failed.`
            );
          }
        }

        return res.redirect(
          `${process.env.FRONTEND_URL}/payment/status?orderId=${orderId}&type=${payment.paymentType}`
        );
      } catch (error) {
        console.error("Error processing successful payment:", error);
        return res.redirect(
          `${
            process.env.FRONTEND_URL
          }/payment/status?error=1&message=${encodeURIComponent(error.message)}`
        );
      }
    } else {
      // Payment was not successful
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/status?error=1&message=payment_failed`
      );
    }
  } catch (error) {
    console.error("Payment return error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/status?error=1`);
  }
});

module.exports = router;
