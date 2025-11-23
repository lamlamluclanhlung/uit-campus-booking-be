const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * POST /bookings
 * body: { slotId, facilityId, purpose? }
 */
async function createBooking(req, res) {
  try {
    const userId = req.user.id; // auth.middleware đã gán
    const { slotId, facilityId, purpose } = req.body;

    if (!slotId || !facilityId) {
      return res
        .status(400)
        .json({ message: "slotId and facilityId are required" });
    }

    // 1) check slot tồn tại + thuộc facility
    const slot = await prisma.slot.findUnique({
      where: { id: Number(slotId) },
      include: { facility: true },
    });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    if (slot.facilityId !== Number(facilityId)) {
      return res
        .status(400)
        .json({ message: "Slot does not belong to this facility" });
    }
    if (slot.status !== "AVAILABLE") {
      return res.status(400).json({ message: "Slot is not available" });
    }

    // 2) anti double booking (DB-level unique slotId)
    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.create({
        data: {
          userId,
          facilityId: Number(facilityId),
          slotId: Number(slotId),
          purpose: purpose || null,
          status: "PENDING",
        },
        include: {
          facility: true,
          slot: true,
        },
      });

      await tx.slot.update({
        where: { id: Number(slotId) },
        data: { status: "BOOKED" },
      });

      return b;
    });

    return res.status(201).json(booking);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Slot already booked" });
    }
    console.error(err);
    return res.status(500).json({ message: "Create booking failed" });
  }
}

/**
 * GET /bookings/me
 */
async function getMyBookings(req, res) {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        facility: true,
        slot: true,
      },
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Get my bookings failed" });
  }
}

/**
 * DELETE /bookings/:id
 * hard delete + trả slot về AVAILABLE
 */
async function cancelBooking(req, res) {
  try {
    const userId = req.user.id;
    const bookingId = Number(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.delete({ where: { id: bookingId } });
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { status: "AVAILABLE" },
      });
    });

    res.json({ message: "Booking canceled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cancel booking failed" });
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
