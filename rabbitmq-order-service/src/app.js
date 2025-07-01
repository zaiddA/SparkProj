const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const env = require("./config/env");
const orderRoutes = require("./routes/order.routes");
const offerRoutes = require("./routes/offer.routes");
const cancellationRoutes = require("./routes/cancellation.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB(env.mongodbUri);

// Mount order routes
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/cancellations", cancellationRoutes);
app.use("/api/admin", adminRoutes);

const PORT = env.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
