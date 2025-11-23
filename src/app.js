const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const facilityRoutes = require("./routes/facility.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/facilities", facilityRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Campus Booking API is running!" });
});

module.exports = app;
