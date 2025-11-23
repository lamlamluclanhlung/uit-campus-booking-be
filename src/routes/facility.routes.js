const router = require("express").Router();
const {
  listFacilities,
  getFacilityDetail,
  listSlotsByFacilityAndDate
} = require("../controllers/facility.controller");

// GET /facilities
router.get("/", listFacilities);

// GET /facilities/:id
router.get("/:id", getFacilityDetail);

// GET /facilities/:id/slots?date=YYYY-MM-DD
router.get("/:id/slots", listSlotsByFacilityAndDate);

module.exports = router;
