const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

const {
  getPendingBookings,
  approveBooking,
  rejectBooking
} = require("../controllers/admin.controller");

router.get(
  "/bookings/pending",
  auth,
  requireRole(["ADMIN", "MANAGER"]),
  getPendingBookings
);

router.put(
  "/bookings/:id/approve",
  auth,
  requireRole(["ADMIN", "MANAGER"]),
  approveBooking
);

router.put(
  "/bookings/:id/reject",
  auth,
  requireRole(["ADMIN", "MANAGER"]),
  rejectBooking
);

module.exports = router;
