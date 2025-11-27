const express = require("express");
const {
  getFacilities,
  getFacilityById,
  getSlotsByFacility,
} = require("../controllers/facility.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// order quan trọng: route /:id/slots phải đặt TRƯỚC /:id
router.get("/", authMiddleware, getFacilities);
router.get("/:id/slots", authMiddleware, getSlotsByFacility);
router.get("/:id", authMiddleware, getFacilityById);

module.exports = router;
