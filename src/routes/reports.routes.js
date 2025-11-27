const express = require("express");
const { getSummaryReport } = require("../controllers/admin.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/role.middleware");

const router = express.Router();

// GET /reports/summary
router.get("/summary", authMiddleware, requireAdmin, getSummaryReport);

module.exports = router;
