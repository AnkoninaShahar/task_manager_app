require("dotenv").config();
const express = require("express");

const prisma = require("./config/db");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
