const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["vnpay", "momo", "zalopay"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["deposit", "full"],
      required: true,
    },
    depositPercentage: {
      type: Number,
      default: 30,
      required: function () {
        return this.paymentType === "deposit";
      },
    },
    remainingAmount: {
      type: Number,
      required: function () {
        return this.paymentType === "deposit";
      },
    },
    transactionRef: String,
    paymentDate: Date,
    responseCode: String,
    bankCode: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
