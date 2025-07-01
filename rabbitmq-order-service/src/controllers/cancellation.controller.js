const CancelledOrder = require("../models/cancelledOrder.model");

// Stub for ML integration: select potential customers
async function selectPotentialCustomers(cancelledOrder) {
  // In production, call ML service here
  // For now, return a mock list
  return [
    { customerId: "mock1", name: "Customer 1", score: 0.9 },
    { customerId: "mock2", name: "Customer 2", score: 0.8 },
  ];
}

// Stub for dynamic offer generation
function generateOffer(cancelledOrder, customer) {
  // In production, use cost analysis and ML
  // For now, return a mock offer
  return {
    offerId: `${cancelledOrder.orderId}-${customer.customerId}`,
    orderId: cancelledOrder.orderId,
    customerId: customer.customerId,
    discount: 10, // mock discount
    deliveryTime: "2 days",
    status: "pending",
  };
}

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId, customerName, items, totalAmount, cancellationReason } =
      req.body;
    if (!orderId || !customerName || !items || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const cancelledOrder = new CancelledOrder({
      orderId,
      customerName,
      items,
      totalAmount,
      cancellationReason,
    });
    await cancelledOrder.save();

    // Trigger reallocation workflow (stub)
    const potentialCustomers = await selectPotentialCustomers(cancelledOrder);
    const offers = potentialCustomers.map((cust) =>
      generateOffer(cancelledOrder, cust)
    );
    // In production, save offers and trigger notifications
    // For now, just return them
    res
      .status(201)
      .json({ message: "Cancellation received, reallocation started", offers });
  } catch (err) {
    console.error("Cancellation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
