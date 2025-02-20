// useTodoList.js
import { useEffect, useState } from "react";
import { API_PROD, API_DEV } from "../config";

const API_URL = API_PROD;

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
      showAlert("Erreur lors de la récupération des tâches");
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
      const trimmedText = newText.trim();
      if (!trimmedText) {
        showAlert("Erreur : Veuillez saisir un texte valide pour la tâche.");
        return;
      }

      const taskExists = tasks.some(
        (task) =>
          task.text.toLowerCase() === trimmedText.toLowerCase() &&
          task.id !== taskId
      );

      if (taskExists) {
        showAlert("Erreur : Cette tâche existe déjà.");
        return;
      }

      const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmedText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
      showAlert("Erreur lors de la modification de la tâche");
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

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedTask = await response.json();

      // Si la tâche est archivée
      if (updatedTask.archived) {
        // Retirer de la liste principale et ajouter aux archives
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setArchivedTasks((prev) => {
          // Vérifier si la tâche n'existe pas déjà dans les archives
          const exists = prev.some((task) => task.id === taskId);
          if (!exists) {
            return [...prev, updatedTask];
          }
          return prev;
        });
      } else {
        // Si la tâche est désarchivée
        // Retirer des archives et ajouter à la liste principale
        setArchivedTasks((prev) => prev.filter((task) => task.id !== taskId));
        setTasks((prev) => {
          // Vérifier si la tâche n'existe pas déjà dans la liste principale
          const exists = prev.some((task) => task.id === taskId);
          if (!exists) {
            return [...prev, updatedTask];
          }
          return prev;
        });
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
