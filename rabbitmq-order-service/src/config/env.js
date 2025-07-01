require("dotenv").config();
module.exports = {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  queueOrderCreated: process.env.QUEUE_ORDER_CREATED,
  queueOfferGenerated: process.env.QUEUE_OFFER_GENERATED,
};
