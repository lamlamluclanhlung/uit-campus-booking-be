const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");

const {
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/booking.controller");

router.post("/", auth, createBooking);
router.get("/me", auth, getMyBookings);
router.delete("/:id", auth, cancelBooking);

module.exports = router;
