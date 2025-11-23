const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const genQrToken = () =>
  "QR-" + Math.random().toString(36).slice(2) + Date.now();

/**
 * GET /admin/bookings/pending
 */
async function getPendingBookings(req, res) {
  try {
    const list = await prisma.booking.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        facility: true,
        slot: true
      }
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get pending bookings failed" });
  }
}

/**
 * PUT /admin/bookings/:id/approve
 * set APPROVED + generate qrToken
 */
async function approveBooking(req, res) {
  try {
    const id = Number(req.params.id);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "PENDING")
      return res.status(400).json({ message: "Only PENDING can be approved" });

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "APPROVED",
        qrToken: genQrToken()
      },
      include: { user: true, facility: true, slot: true }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approve booking failed" });
  }
}

/**
 * PUT /admin/bookings/:id/reject
 * HARD delete booking + slot AVAILABLE
 * (vì slotId @unique nên giữ record sẽ block rebook)
 */
async function rejectBooking(req, res) {
  try {
    const id = Number(req.params.id);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "PENDING")
      return res.status(400).json({ message: "Only PENDING can be rejected" });

    await prisma.$transaction(async (tx) => {
      await tx.booking.delete({ where: { id } });
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { status: "AVAILABLE" }
      });
    });

    res.json({ message: "Rejected and freed slot" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reject booking failed" });
  }
}

module.exports = {
  getPendingBookings,
  approveBooking,
  rejectBooking
};
