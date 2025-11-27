const prisma = require("../prismaClient");

// GET /facilities
async function getFacilities(req, res) {
  try {
    const facilities = await prisma.facility.findMany({
      orderBy: { name: "asc" }
    });
    return res.json(facilities);
  } catch (err) {
    console.error("Get facilities error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /facilities/:id
async function getFacilityById(req, res) {
  try {
    const id = Number(req.params.id);
    const facility = await prisma.facility.findUnique({
      where: { id }
    });

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    return res.json(facility);
  } catch (err) {
    console.error("Get facility by id error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /facilities/:id/slots?date=YYYY-MM-DD
async function getSlotsByFacility(req, res) {
  try {
    const facilityId = Number(req.params.id);
    const { date } = req.query;

    const where = { facilityId };

    if (date) {
      const dayStart = new Date(date + "T00:00:00.000Z");
      const dayEnd = new Date(date + "T23:59:59.999Z");
      where.startTime = { gte: dayStart, lte: dayEnd };
    }

    const slots = await prisma.slot.findMany({
      where,
      orderBy: { startTime: "asc" }
    });

    return res.json(slots);
  } catch (err) {
    console.error("Get slots by facility error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getFacilities,
  getFacilityById,
  getSlotsByFacility
};
