const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/booking.controller");

// Student tạo booking
router.post("/", requireAuth, createBooking);

// Student xem booking của mình
router.get("/me", requireAuth, getMyBookings);

// Student hủy booking
router.delete("/:id", requireAuth, cancelBooking);

module.exports = router;
