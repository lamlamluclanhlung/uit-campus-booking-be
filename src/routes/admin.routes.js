const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

const {
  getPendingBookings,
  approveBooking,
  rejectBooking
} = require("../controllers/admin.controller");

// Admin xem pending
router.get(
  "/bookings/pending",
  auth,
  requireRole(["ADMIN", "MANAGER"]),
  getPendingBookings
);

// Admin approve
router.put(
  "/bookings/:id/approve",
  auth,
  requireRole(["ADMIN", "MANAGER"]),
  approveBooking
);

// Admin reject
router.put(
  "/bookings/:id/reject",
  auth,
  requireRole(["ADMIN", "MANAGER"]),
  rejectBooking
);

module.exports = router;
