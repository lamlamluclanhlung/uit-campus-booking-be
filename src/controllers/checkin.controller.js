const prisma = require("../prismaClient");

// POST /checkins/qr
async function checkinByQR(req, res) {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({ message: "Missing qrToken" });
    }

    const booking = await prisma.booking.findFirst({
      where: { qrToken },
      include: {
        user: true,
        facility: true,
        slot: true
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "Invalid QR token" });
    }

    if (booking.status !== "APPROVED") {
      return res
        .status(400)
        .json({ message: "Booking is not approved yet" });
    }

    const existingCheckin = await prisma.checkIn.findFirst({
      where: { bookingId: booking.id }
    });

    if (existingCheckin) {
      return res.status(400).json({ message: "Already checked in" });
    }

    const checkin = await prisma.checkIn.create({
      data: {
        bookingId: booking.id,
        method: "QR"
        // checkinTime default now()
      }
    });

    // Option: cập nhật status booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CHECKED_IN" }
    });

    return res.json({ booking, checkin });
  } catch (err) {
    console.error("Checkin by QR error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  checkinByQR
};
