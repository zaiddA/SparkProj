const mongoose = require("mongoose");

const cancelledOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  items: { type: [String], required: true },
  totalAmount: { type: Number, required: true },
  cancellationReason: { type: String },
  cancelledAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }, // pending, reallocated, returned
});

module.exports = mongoose.model("CancelledOrder", cancelledOrderSchema);
