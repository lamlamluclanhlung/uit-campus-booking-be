const { v4: uuidv4 } = require("uuid");
const prisma = require("../prismaClient");

// POST /bookings
async function createBooking(req, res) {
  try {
    const { facilityId, slotId, purpose } = req.body;

    if (!facilityId || !slotId) {
      return res
        .status(400)
        .json({ message: "Missing facilityId or slotId" });
    }

    const slot = await prisma.slot.findUnique({
      where: { id: Number(slotId) },
      include: { facility: true }
    });

    if (!slot || slot.facilityId !== Number(facilityId)) {
      return res.status(400).json({ message: "Invalid slot" });
    }

    // Slot đã có booking APPROVED?
    const existingApproved = await prisma.booking.findFirst({
      where: {
        slotId: Number(slotId),
        status: "APPROVED"
      }
    });

    if (existingApproved) {
      return res
        .status(400)
        .json({ message: "This slot has already been approved for another booking" });
    }

    const qrToken = uuidv4();

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        facilityId: Number(facilityId),
        slotId: Number(slotId),
        purpose: purpose || "",
        status: "PENDING",
        qrToken
      },
      include: {
        facility: true,
        slot: true
      }
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /bookings/me
async function getMyBookings(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        facility: true,
        slot: true
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json(bookings);
  } catch (err) {
    console.error("Get my bookings error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /bookings/:id
async function cancelBooking(req, res) {
  try {
    const id = Number(req.params.id);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== req.user.id) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "APPROVED") {
      return res
        .status(400)
        .json({ message: "Cannot cancel an approved booking" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELED" } // đúng enum trong schema
    });

    return res.json({ message: "Booking canceled", booking: updated });
  } catch (err) {
    console.error("Cancel booking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking
};
