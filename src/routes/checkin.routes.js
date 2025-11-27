const express = require("express");
const { checkinByQR } = require("../controllers/checkin.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/role.middleware");

const router = express.Router();

// POST /checkins/qr
router.post("/qr", authMiddleware, requireAdmin, checkinByQR);

module.exports = router;
