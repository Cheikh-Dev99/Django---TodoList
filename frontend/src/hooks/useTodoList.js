// useTodoList.js
import { useEffect, useState } from "react";

// Mettre à jour l'URL de base
const API_BASE_URL = "https://CheikhDev99.pythonanywhere.com/api/";

export default function useTodoList() {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer les tâches
  const fetchTasks = async () => {
    const response = await fetch(`${API_BASE_URL}tasks/`);
    const data = await response.json();
    setTasks(data);
  };

  // Ajouter une tâche
  const addTask = async (task) => {
    const response = await fetch(`${API_BASE_URL}tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  // Supprimer une tâche
  const deleteTask = async (taskId) => {
    const response = await fetch(`${API_BASE_URL}tasks/${taskId}/`, {
      method: "DELETE",
    });
    if (response.ok) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  // Modifier une tâche
  const editTask = async (taskId, updatedTask) => {
    const response = await fetch(`${API_BASE_URL}tasks/${taskId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    if (response.ok) {
      const updatedTaskData = await response.json();
      setTasks(
        tasks.map((task) => (task.id === taskId ? updatedTaskData : task))
      );
    }
  };

  // Toggle complétion d'une tâche
  const toggleComplete = async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const response = await fetch(`${API_BASE_URL}tasks/${taskId}/`, {
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
    const response = await fetch(`${API_BASE_URL}tasks/${taskId}/archive/`, {
      method: "PATCH",
    });
    if (response.ok) {
      const updatedTask = await response.json();
      setTasks(tasks.filter((task) => task.id !== taskId));
      setArchivedTasks([...archivedTasks, updatedTask]);
    }
  };

  // Supprimer les tâches complétées
  const deleteCompletedTasks = async () => {
    const response = await fetch(`${API_BASE_URL}tasks/delete_completed/`, {
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

    await fetch(`${API_BASE_URL}tasks/reorder/`, {
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
