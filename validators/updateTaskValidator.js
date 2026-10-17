const { z } = require("zod");

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isComplete: z.boolean().optional(),
});

module.exports = { updateTaskSchema };
