const express = require("express");
const router = express.Router();
const { cancelOrder } = require("../controllers/cancellation.controller");

// POST /api/cancellations
router.post("/", cancelOrder);

module.exports = router;
