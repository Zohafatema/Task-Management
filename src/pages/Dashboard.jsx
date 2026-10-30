
import { useEffect, useState } from "react";

import {
  Plus,
  Trash2,
  Edit,
  Search,
  X
} from "lucide-react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "../services/api";

const Dashboard = () => {

  const initialForm = {
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: ""
  };

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const fetchTasks = () => {
    setTasks(getTasks());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD OR UPDATE TASK
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        updateTask(editingId, form);
      } else {
        createTask(form);
      }

      setForm(initialForm);
      setEditingId(null);
      fetchTasks();

    } catch (err) {
      setError(err.message);
    }
  };

  // EDIT TASK
  const handleEdit = (task) => {
    setEditingId(task.id);

    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // DELETE TASK
  const handleDelete = (id) => {
    if (window.confirm("Delete this task?")) {
      deleteTask(id);
      fetchTasks();
    }
  };

  // CHANGE STATUS
  const updateStatus = (task, status) => {
    updateTask(task.id, { status });
    fetchTasks();
  };

  // SEARCH AND FILTER
  const filteredTasks = tasks.filter(task => {

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || task.status === filter;

    return matchesSearch && matchesFilter;
  });

  const completed = tasks.filter(
    task => task.status === "Completed"
  ).length;

  const pending = tasks.filter(
    task => task.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    task => task.status === "In Progress"
  ).length;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  return (
    <div className="dashboard">

      <div className="dashboard-heading">
        <div>
          <h1>My Dashboard</h1>
          <p>Organize your work and achieve your goals.</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {/* STATISTICS */}

      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Tasks</span>
          <h2>{tasks.length}</h2>
        </div>

        <div className="stat-card">
          <span>Pending Tasks</span>
          <h2>{pending}</h2>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <h2>{inProgress}</h2>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <h2>{progress}%</h2>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* TASK FORM */}

      <div className="task-form-card">

        <h2>
          {editingId ? "Update Task" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Task Title"
            value={form.title}
            required
            onChange={e =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Task Description"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="form-row">

            <select
              value={form.status}
              onChange={e =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select
              value={form.priority}
              onChange={e =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={e =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />

          </div>

          <div className="form-actions">

            <button className="primary-btn" type="submit">
              <Plus size={18} />
              {editingId ? "Update Task" : "Add Task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                <X size={18} />
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* TASK LIST */}

      <div className="task-section">

        <div className="task-heading">
          <h2>My Tasks</h2>
          <p>Manage and track your daily activities.</p>
        </div>

        <div className="task-controls">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

        </div>

        <div className="task-grid">

          {filteredTasks.length === 0 ? (

            <div className="empty-state">
              <h3>No tasks found</h3>
              <p>Create your first task!</p>
            </div>

          ) : (

            filteredTasks.map(task => (

              <div className="task-card" key={task.id}>

                <div className="task-top">

                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>

                  <div className="task-actions">

                    <button onClick={() => handleEdit(task)}>
                      <Edit size={17} />
                    </button>

                    <button onClick={() => handleDelete(task.id)}>
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

                <h3>{task.title}</h3>

                <p>{task.description || "No description provided."}</p>

                {task.dueDate && (
                  <small>
                    Due: {new Date(task.dueDate + "T00:00:00").toLocaleDateString()}
                  </small>
                )}

                <div className="task-bottom">

                  <select
                    value={task.status}
                    onChange={e =>
                      updateStatus(task, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
                    {task.status}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
