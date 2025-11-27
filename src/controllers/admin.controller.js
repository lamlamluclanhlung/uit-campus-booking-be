const prisma = require("../prismaClient");

// GET /admin/bookings/pending
async function getPendingBookings(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: "PENDING" },
      include: {
        user: true,
        facility: true,
        slot: true
      },
      orderBy: { createdAt: "asc" }
    });

    return res.json(bookings);
  } catch (err) {
    console.error("Get pending bookings error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /admin/bookings/:id/approve
async function approveBooking(req, res) {
  try {
    const id = Number(req.params.id);

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      include: {
        user: true,
        facility: true,
        slot: true
      }
    });

    // Option: update slot.status = BOOKED
    try {
      await prisma.slot.update({
        where: { id: booking.slotId },
        data: { status: "BOOKED" }
      });
    } catch (e) {
      console.warn("Update slot status failed (optional):", e.message);
    }

    return res.json(booking);
  } catch (err) {
    console.error("Approve booking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /admin/bookings/:id/reject
async function rejectBooking(req, res) {
  try {
    const id = Number(req.params.id);

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: "REJECTED",
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      include: {
        user: true,
        facility: true,
        slot: true
      }
    });

    return res.json(booking);
  } catch (err) {
    console.error("Reject booking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /reports/summary
async function getSummaryReport(req, res) {
  try {
    const [
      totalUsers,
      totalFacilities,
      totalBookings,
      pending,
      approved,
      rejected,
      canceled
    ] = await Promise.all([
      prisma.user.count(),
      prisma.facility.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "APPROVED" } }),
      prisma.booking.count({ where: { status: "REJECTED" } }),
      prisma.booking.count({ where: { status: "CANCELED" } })
    ]);

    return res.json({
      totalUsers,
      totalFacilities,
      totalBookings,
      pending,
      approved,
      rejected,
      canceled
    });
  } catch (err) {
    console.error("Summary report error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getPendingBookings,
  approveBooking,
  rejectBooking,
  getSummaryReport
};
