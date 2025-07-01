const amqp = require("amqplib");
const Offer = require("../models/offer.model");
const env = require("../config/env");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

async function consumeOrders() {
  // Ensure MongoDB is connected
  await connectDB(env.mongodbUri);
  // Connect to RabbitMQ
  const connection = await amqp.connect(env.rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(env.queueOrderCreated, { durable: true });
  console.log("Waiting for messages in", env.queueOrderCreated);

  channel.consume(env.queueOrderCreated, async (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      // Generate offer (simple random logic for demo)
      const offer = new Offer({
        offerId: uuidv4(),
        orderId: order.orderId,
        discount: Math.floor(Math.random() * 30) + 1, // 1-30% discount
        deliveryTime: `${Math.floor(Math.random() * 5) + 1} days`,
      });
      await offer.save();
      console.log("Offer generated and saved:", offer);
      channel.ack(msg);
    }
  });
}

module.exports = { consumeOrders };

// Allow running directly
if (require.main === module) {
  consumeOrders().catch((err) => {
    console.error("Consumer error:", err);
    process.exit(1);
  });
}
