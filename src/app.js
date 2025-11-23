const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());           // Day 1 mở CORS cho dev
app.use(express.json());   // parse JSON body

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Campus Booking API is running!" });
});

module.exports = app;

