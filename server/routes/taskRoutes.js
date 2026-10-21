const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/auth");
const { createTaskSchema } = require("../validators/createTaskValidator");
const { updateTaskSchema } = require("../validators/updateTaskValidator");

// Import the controller functions
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", authenticateToken, getTasks);

router.get("/:id", authenticateToken, getTaskById);

router.post("/", authenticateToken, validate(createTaskSchema), createTask);

router.put("/:id", authenticateToken, validate(updateTaskSchema), updateTask);

router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;
