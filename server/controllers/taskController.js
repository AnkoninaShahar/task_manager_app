const prisma = require("../config/db");

// Get all tasks for the logged-in user
const getTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.send(tasks);
  } catch (error) {
    next(error);
  }
};

// Get a single task by ID
const getTaskById = async (req, res, next) => {
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
};

// Create a new task
const createTask = async (req, res, next) => {
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
};

// Update an existing task
const updateTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, isComplete } = req.body;

    const updatedTask = await prisma.task.updateMany({
      where: { id, userId: req.user.userId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isComplete !== undefined && { isComplete }),
      },
    });

    if (updatedTask.count === 0) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    const task = await prisma.task.findUnique({ where: { id } });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete a task
const deleteTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const deletedTask = await prisma.task.delete({
      where: { id, userId: req.user.userId },
    });

    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
