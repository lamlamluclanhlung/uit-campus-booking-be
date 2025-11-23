const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /facilities
async function listFacilities(req, res) {
  const facilities = await prisma.facility.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" }
  });
  res.json(facilities);
}

// GET /facilities/:id
async function getFacilityDetail(req, res) {
  const id = Number(req.params.id);
  const facility = await prisma.facility.findUnique({ where: { id } });

  if (!facility) {
    return res.status(404).json({ message: "Facility not found" });
  }
  res.json(facility);
}

// GET /facilities/:id/slots?date=YYYY-MM-DD
async function listSlotsByFacilityAndDate(req, res) {
  const facilityId = Number(req.params.id);
  const dateStr = req.query.date; // optional

  let start, end;

  if (dateStr) {
    // lọc theo 1 ngày cụ thể
    start = new Date(dateStr + "T00:00:00.000Z");
    end   = new Date(dateStr + "T23:59:59.999Z");
  } else {
    // không truyền date => lấy 3 ngày tới
    start = new Date();
    end = new Date();
    end.setDate(end.getDate() + 3);
  }

  const slots = await prisma.slot.findMany({
    where: {
      facilityId,
      startTime: { gte: start, lte: end }
    },
    orderBy: { startTime: "asc" }
  });

  res.json(slots);
}

module.exports = {
  listFacilities,
  getFacilityDetail,
  listSlotsByFacilityAndDate
};
