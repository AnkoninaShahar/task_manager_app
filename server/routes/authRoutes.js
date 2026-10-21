const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const { authSchema } = require("../validators/authValidator");

// Import the auth controllers
const { register, login } = require("../controllers/authController");

router.post("/register", validate(authSchema), register);

router.post("/login", validate(authSchema), login);

module.exports = router;
