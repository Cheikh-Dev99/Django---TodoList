// useTodoList.js
import { useEffect, useState } from "react";

const API_URL = "https://django-todo-backend-50w9.onrender.com/api";

export default function useTodoList() {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les tâches
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "omit",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error:", error);
      setTasks([]);
    }
  };

  // Ajouter une tâche
  const addTask = async (text) => {
    try {
      const response = await fetch(`${API_URL}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ text, completed: false }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTasks((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Supprimer une tâche
  const deleteTask = async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
      method: "DELETE",
    });
    if (response.ok) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  // Modifier une tâche
  const editTask = async (taskId, newText) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newText,
          completed:
            tasks.find((task) => task.id === taskId)?.completed || false,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedTaskData = await response.json();
      setTasks(
        tasks.map((task) => (task.id === taskId ? updatedTaskData : task))
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Toggle complétion d'une tâche
  const toggleComplete = async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (response.ok) {
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    }
  };

  // Archiver une tâche
  const archiveTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/archive/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedTask = await response.json();

      if (updatedTask.archived) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setArchivedTasks((prev) => [...prev, updatedTask]);
      } else {
        setArchivedTasks((prev) => prev.filter((task) => task.id !== taskId));
        setTasks((prev) => [...prev, updatedTask]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Supprimer les tâches complétées
  const deleteCompletedTasks = async () => {
    const response = await fetch(`${API_URL}/tasks/delete_completed/`, {
      method: "DELETE",
    });
    if (response.ok) {
      setTasks(tasks.filter((task) => !task.completed));
    }
  };

  // Réorganiser les tâches
  const reorderTasks = async (startIndex, endIndex) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const updatedTasks = result.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTasks(updatedTasks);

    await fetch(`${API_URL}/tasks/reorder/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks: updatedTasks.map((task) => task.id),
      }),
    });
  };

  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks();
  }, []);

  const showAlert = (message) => {
    setAlert({ show: true, message });
    setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  };

  const getFilteredTasks = (taskList) => {
    let filteredTasks = [...taskList];

    if (searchTerm) {
      filteredTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filteredTasks.sort((a, b) => a.order - b.order);

    switch (filter) {
      case "active":
        return filteredTasks.filter((task) => !task.completed);
      case "completed":
        return filteredTasks.filter((task) => task.completed);
      default:
        return filteredTasks;
    }
  };

  const tasksToRender = tasks.length > 0 ? getFilteredTasks(tasks) : [];
  const archivedTasksToRender =
    archivedTasks.length > 0 ? getFilteredTasks(archivedTasks) : [];

  return {
    tasks: tasksToRender,
    archivedTasks: archivedTasksToRender,
    filter,
    alert,
    searchTerm,
    setFilter,
    setSearchTerm,
    fetchTasks,
    addTask,
    deleteTask,
    editTask,
    toggleComplete,
    archiveTask,
    deleteCompletedTasks,
    reorderTasks,
  };
}
