// src/app.js
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const facilityRoutes = require("./routes/facility.routes");
const bookingRoutes = require("./routes/booking.routes");
const adminRoutes = require("./routes/admin.routes");
const checkinRoutes = require("./routes/checkin.routes");
const reportsRoutes = require("./routes/reports.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Campus Booking API is running!" });
});

// Public routes
app.use("/auth", authRoutes);

// Protected / business routes
app.use("/facilities", facilityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/checkins", checkinRoutes);
app.use("/reports", reportsRoutes);

module.exports = app;
