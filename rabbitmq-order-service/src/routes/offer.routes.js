const express = require("express");
const router = express.Router();
const {
  getOffers,
  acceptOffer,
  rejectOffer,
} = require("../controllers/offer.controller");
// add offer routes here

// GET /api/offers
router.get("/", getOffers);
// POST /api/offers/:offerId/accept
router.post("/:offerId/accept", acceptOffer);
// POST /api/offers/:offerId/reject
router.post("/:offerId/reject", rejectOffer);

module.exports = router;
