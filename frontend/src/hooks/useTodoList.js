// useTodoList.js
import axios from "axios";
import { useEffect, useState } from "react";

export default function useTodoList() {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, []);

  const showAlert = (message) => {
    setAlert({ show: true, message });
    setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  };

  const addTask = (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const taskExists = tasks.some(
      (task) => task.text.toLowerCase() === trimmedText.toLowerCase()
    );
    if (taskExists) {
      showAlert("Erreur : Cette tâche existe déjà.");
      return;
    }

    axios
      .post("http://localhost:8000/api/tasks/", { text: trimmedText })
      .then((response) => setTasks([response.data, ...tasks]))
      .catch((error) => console.error(error));
  };

  const toggleComplete = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    axios
      .patch(`http://localhost:8000/api/tasks/${taskId}/`, {
        completed: !task.completed,
      })
      .then((response) => {
        setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
      })
      .catch((error) => console.error(error));
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${taskId}/`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error(error));
  };

  const editTask = (taskId, newText) => {
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

    axios
      .patch(`http://localhost:8000/api/tasks/${taskId}/`, { text: newText })
      .then((response) => {
        setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
      })
      .catch((error) => console.error(error));
  };

  const archiveTask = (taskId) => {
    const taskToArchive = tasks.find((task) => task.id === taskId);
    if (taskToArchive) {
      setTasks(tasks.filter((t) => t.id !== taskId));
      setArchivedTasks((prev) => [
        ...prev,
        { ...taskToArchive, archived: true },
      ]);
    } else {
      const taskToUnarchive = archivedTasks.find((task) => task.id === taskId);
      if (taskToUnarchive) {
        setArchivedTasks((prev) => prev.filter((task) => task.id !== taskId));
        setTasks((prev) => [...prev, { ...taskToUnarchive, archived: false }]);
      }
    }
  };

  const deleteCompletedTasks = () => {
    axios
      .delete(`http://localhost:8000/api/tasks/delete_completed/`)
      .then(() => {
        setTasks(tasks.filter((task) => !task.completed));
      })
      .catch((error) => console.error(error));
  };

  const reorderTasks = (startIndex, endIndex) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const updatedTasks = result.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTasks(updatedTasks);

    axios
      .patch(`http://localhost:8000/api/tasks/reorder/`, {
        tasks: updatedTasks.map((task) => task.id),
      })
      .catch((error) => console.error(error));
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
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    archiveTask,
    deleteCompletedTasks,
    setFilter,
    searchTerm,
    setSearchTerm,
    reorderTasks,
  };
}
