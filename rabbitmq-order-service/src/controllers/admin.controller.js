const CancelledOrder = require("../models/cancelledOrder.model");
const Offer = require("../models/offer.model");

const getStats = async (req, res) => {
  try {
    const totalCancelled = await CancelledOrder.countDocuments();
    const totalOffers = await Offer.countDocuments();
    const acceptedOffers = await Offer.countDocuments({ status: "accepted" });
    const rejectedOffers = await Offer.countDocuments({ status: "rejected" });
    const pendingOffers = await Offer.countDocuments({ status: "pending" });
    res.json({
      totalCancelled,
      totalOffers,
      acceptedOffers,
      rejectedOffers,
      pendingOffers,
      acceptanceRate: totalOffers ? acceptedOffers / totalOffers : 0,
      rejectionRate: totalOffers ? rejectedOffers / totalOffers : 0,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

module.exports = { getStats };
