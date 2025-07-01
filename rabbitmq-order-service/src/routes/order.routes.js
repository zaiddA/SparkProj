const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/order.controller");
// add order routes here

// POST /api/orders
router.post("/", createOrder);

module.exports = router;
