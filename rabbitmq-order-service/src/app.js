const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');
const { publishOrder } = require('./rabbit/publisher');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.post('/api/order', async (req, res) => {
  try {
    const { customer, items, total } = req.body;
    const order = new Order({ customer, items, total });
    await order.save();
    await publishOrder(order);
    res.json({ message: 'Order saved to MongoDB and published to RabbitMQ!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save order or publish message' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
