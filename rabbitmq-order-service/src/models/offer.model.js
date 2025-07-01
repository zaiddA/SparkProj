const mongoose = require("mongoose");
const offerSchema = new mongoose.Schema({
  offerId: String,
  orderId: String,
  customerId: String,
  discount: Number,
  deliveryTime: String,
  status: { type: String, default: "pending" },
  respondedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Offer", offerSchema);
