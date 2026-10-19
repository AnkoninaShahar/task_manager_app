const express = require("express");
const router = express.Router();

const prisma = require("../config/db");

const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/auth");
const { createTaskSchema } = require("../validators/createTaskValidator");
const { updateTaskSchema } = require("../validators/updateTaskValidator");

router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.send(tasks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id, userId: req.user.userId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.send(task);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authenticateToken,
  validate(createTaskSchema),
  async (req, res, next) => {
    try {
      const { title, description } = req.body;

      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          userId: req.user.userId,
        },
      });

      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  authenticateToken,
  validate(updateTaskSchema),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { title, description, isComplete } = req.body;

      const updatedTask = await prisma.task.update({
        where: { id, userId: req.user.userId },
        data: {
          title,
          description,
          isComplete,
        },
      });

      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  },
);

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const deletedTask = await prisma.task.delete({
      where: { id, userId: req.user.userId },
    });

    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
