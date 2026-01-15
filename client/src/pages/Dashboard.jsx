import { useEffect, useState } from "react";
import { API_URL } from "../api";
import "./Dashboard.css";

export default function Dashboard({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch(`${API_URL}/tasks`, { headers })
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []));
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    setTasks([data, ...tasks]);
    setTitle("");
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ completed: !task.completed }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers,
    });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const filtered = tasks
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) =>
      filter === "all"
        ? true
        : filter === "done"
        ? t.completed
        : !t.completed
    );

  return (
    <div className="dash">
      <div className="header">
        <h2>My Tasks</h2>
        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* ADD TASK */}
      <div className="add-row">
        <input
          placeholder="Add a new task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="primary" onClick={addTask}>
          Add
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search tasks…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          📋 All
        </button>
        <button
          className={filter === "done" ? "active" : ""}
          onClick={() => setFilter("done")}
        >
          ✔ Done
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          ⏳ Pending
        </button>
      </div>

      {/* TASK LIST */}
      <div className="list">
        {filtered.map((task) => (
          <div
            key={task._id}
            className={`task ${task.completed ? "done" : ""}`}
          >
            <span>{task.title}</span>

            <div className="actions">
              <button
                className="done-btn"
                onClick={() => toggleTask(task._id)}
                title="Mark done"
              >
                ✔
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task._id)}
                title="Delete"
              >
                ✖
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="empty">No tasks found ✨</p>
        )}
      </div>
    </div>
  );
}
