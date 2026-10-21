const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

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
};

// Log in an existing user
const login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

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
};

module.exports = {
  register,
  login,
};
