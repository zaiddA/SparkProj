const amqp = require("amqplib");
const env = require("../config/env");

async function publishToQueue(queueName, message) {
  const connection = await amqp.connect(env.rabbitmqUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  await channel.close();
  await connection.close();
}

module.exports = { publishToQueue };
