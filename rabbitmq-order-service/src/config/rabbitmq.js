const amqp = require("amqplib");
const connectRabbitMQ = async (url) => {
  try {
    const connection = await amqp.connect(url);
    console.log("RabbitMQ connected");
    return connection;
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
    process.exit(1);
  }
};
module.exports = connectRabbitMQ;
