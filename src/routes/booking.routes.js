const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/booking.controller");

// Student tạo booking
router.post("/", auth, createBooking);

// Student xem booking của mình
router.get("/me", auth, getMyBookings);

// Student hủy booking
router.delete("/:id", auth, cancelBooking);

module.exports = router;
