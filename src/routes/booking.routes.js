// src/routes/booking.routes.js
const express = require("express");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/booking.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/me", authMiddleware, getMyBookings);
router.delete("/:id", authMiddleware, cancelBooking);

module.exports = router;
