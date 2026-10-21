import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setError("Failed to load tasks. Please log in again.");
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      setError("Failed to create task.");
      console.error(err);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { isComplete: !currentStatus });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task status.");
      console.error(err);
    }
  };

  const handleStartEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleSaveEdit = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError("Failed to save task edits.");
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Task Dashboard</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Log Out
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Add a description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editingId === task.id ? (
              // Edit Mode Form
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <div className="task-actions">
                  <button
                    onClick={() => handleSaveEdit(task.id)}
                    className="btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Normal View Mode
              <>
                <div className="task-content">
                  <span
                    className={`task-title ${task.isComplete ? "completed" : ""}`}
                  >
                    {task.title}
                  </span>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    onClick={() =>
                      handleToggleComplete(task.id, task.isComplete)
                    }
                    className="btn-secondary"
                  >
                    {task.isComplete ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
