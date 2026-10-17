require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("./generated/prisma");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const validate = require("./middleware/validate");
const { createTaskSchema } = require("./validators/createTaskValidator");
const { updatedTaskSchema } = require("./validators/updateTaskValidator");

const prisma = new PrismaClient({ adapter });
const app = express();

app.use(express.json());

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.send(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.send(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to find task" });
  }
});

app.post("/api/tasks", validate(createTaskSchema), async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", validate(updatedTaskSchema), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, isComplete } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        isComplete,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletedTask = await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
