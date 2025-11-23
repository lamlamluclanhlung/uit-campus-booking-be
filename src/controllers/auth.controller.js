const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const emailRegex = /\S+@\S+\.\S+/;

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "STUDENT" },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(user);
  } catch (err) {
    if (err.code === "P2002")
      return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  if (!emailRegex.test(email))
    return res.status(400).json({ message: "Invalid email format" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}

async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true }
  });
  res.json(user);
}

module.exports = { register, login, me };
