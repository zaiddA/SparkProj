// Handles offer generation logic
const Offer = require("../models/offer.model");

const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

const acceptOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findOneAndUpdate(
      { offerId },
      { status: "accepted", respondedAt: new Date() },
      { new: true }
    );
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    res.json({ message: "Offer accepted", offer });
  } catch (err) {
    console.error("Error accepting offer:", err);
    res.status(500).json({ error: "Failed to accept offer" });
  }
};

const rejectOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findOneAndUpdate(
      { offerId },
      { status: "rejected", respondedAt: new Date() },
      { new: true }
    );
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    res.json({ message: "Offer rejected", offer });
  } catch (err) {
    console.error("Error rejecting offer:", err);
    res.status(500).json({ error: "Failed to reject offer" });
  }
};

module.exports = { getOffers, acceptOffer, rejectOffer };
