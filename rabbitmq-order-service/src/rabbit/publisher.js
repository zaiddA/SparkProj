const amqp = require('amqplib');
const QUEUE_NAME = process.env.QUEUE_NAME || 'order.created';

async function publishOrder(order) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: false });
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(order)));
  setTimeout(() => {
    connection.close();
  }, 500);
}

module.exports = { publishOrder }; 