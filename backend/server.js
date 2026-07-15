// 1. Load environment variables using absolute path to prevent "undefined" URI errors
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// 2. Import Route Modules
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 3. Establish Database Connection
connectDB();

const app = express();

// 4. Global Middleware Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. API Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// 6. Application Route Bindings
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// 7. Fallback Routing & Global Error Processing (Must remain at the bottom)
app.use(notFound);
app.use(errorHandler);

// 8. Server Boot Initialization
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});

module.exports = app;
