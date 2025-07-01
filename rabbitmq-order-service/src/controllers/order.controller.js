// Handles order validation, saving to DB, and publishing to RabbitMQ
const Order = require("../models/Order");
const { v4: uuidv4 } = require("uuid");
const connectRabbitMQ = require("../config/rabbitmq");
const env = require("../config/env");

module.exports = {
  // add controller functions here
  createOrder: async (req, res) => {
    try {
      const { customerName, items, totalAmount } = req.body;
      if (
        !customerName ||
        !Array.isArray(items) ||
        !items.length ||
        !totalAmount
      ) {
        return res.status(400).json({ error: "Invalid order data" });
      }
      const orderId = uuidv4();
      const order = new Order({ orderId, customerName, items, totalAmount });
      await order.save();

      // Publish to RabbitMQ
      const connection = await connectRabbitMQ(env.rabbitmqUrl);
      const channel = await connection.createChannel();
      await channel.assertQueue(env.queueOrderCreated, { durable: true });
      channel.sendToQueue(
        env.queueOrderCreated,
        Buffer.from(JSON.stringify(order))
      );
      await channel.close();
      await connection.close();

      res.status(201).json({ message: "Order created", order });
    } catch (err) {
      console.error("Order creation error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
