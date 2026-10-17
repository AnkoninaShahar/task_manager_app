const express = require("express");
const router = express.Router();

const prisma = require("../config/db");

const validate = require("../middleware/validate");
const { authSchema } = require("../validators/authValidator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", validate(authSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      return res.status(409).json({ error: "Email already exists" });

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPass,
      },
    });

    res.status(201).json({ success: "User successfully created" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validate(authSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!foundUser)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
