const { z } = require("zod");

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 character")
    .regex(/[A-Z]/, "Password must contain at least one uppercase character")
    .regex(/[0-9]/, "Password much contain at least one number")
    .regex(
      /[!@#$%^&*()_+|~\-]/,
      "Password must conatin at least one special character",
    ),
});

module.exports = { authSchema };
