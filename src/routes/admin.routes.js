const express = require("express");
const {
  getPendingBookings,
  approveBooking,
  rejectBooking,
} = require("../controllers/admin.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/role.middleware");

const router = express.Router();

// /admin/bookings/...
router.get(
  "/bookings/pending",
  authMiddleware,
  requireAdmin,
  getPendingBookings
);

router.put(
  "/bookings/:id/approve",
  authMiddleware,
  requireAdmin,
  approveBooking
);

router.put(
  "/bookings/:id/reject",
  authMiddleware,
  requireAdmin,
  rejectBooking
);

module.exports = router;
