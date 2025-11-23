const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear old data (Day 1 chưa seed booking/checkin nên xóa 2 bảng này đủ)
  await prisma.slot.deleteMany();
  await prisma.facility.deleteMany();

  // Seed facilities
  const facilityData = [
    { name: "A101 Classroom", type: "CLASSROOM", location: "Building A - Floor 1", capacity: 60 },
    { name: "B203 Lab", type: "LAB", location: "Building B - Floor 2", capacity: 35 },
    { name: "C Gym Hall", type: "SPORTS", location: "Building C - Ground", capacity: 80 },
    { name: "A305 Classroom", type: "CLASSROOM", location: "Building A - Floor 3", capacity: 45 },
    { name: "B105 Lab", type: "LAB", location: "Building B - Floor 1", capacity: 30 }
  ];

  const facilities = await Promise.all(
    facilityData.map(data => prisma.facility.create({ data }))
  );

  // Seed slots next 3 days (3 slots/day/facility)
  const now = new Date();
  const slotsData = [];

  for (let d = 0; d < 3; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);

    const starts = [8, 10, 14]; // 8-10, 10-12, 14-16
    for (const f of facilities) {
      for (const h of starts) {
        const start = new Date(day);
        start.setHours(h, 0, 0, 0);
        const end = new Date(start);
        end.setHours(h + 2, 0, 0, 0);

        slotsData.push({
          facilityId: f.id,
          startTime: start,
          endTime: end,
          status: "AVAILABLE"
        });
      }
    }
  }

  await prisma.slot.createMany({ data: slotsData });
  console.log("✅ Seeded", facilities.length, "facilities &", slotsData.length, "slots!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
