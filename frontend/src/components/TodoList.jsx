import { useState } from "react";
import add from "../assets/ajouter.png";
import useTodoList from "../hooks/useTodoList";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Input from "../ui/Input";
import RadioButton from "../ui/RadioButton";
import SectionTitle from "../ui/SectionTitle";
import TodoItem from "./TodoItem";
import todolist from "../assets/logo.png";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function TodoList() {
  const [newTask, setNewTask] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const {
    tasks,
    archivedTasks,
    filter,
    alert,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    archiveTask,
    deleteCompletedTasks,
    setFilter,
    setSearchTerm,
    reorderTasks,
  } = useTodoList();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask("");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Désactiver temporairement les filtres pendant le drag & drop
    if (filter !== "all") {
      setFilter("all");
    }

    reorderTasks(sourceIndex, destinationIndex);
  };

  return (
    <div className="container bg-white mx-auto max-w-3xl p-8 rounded-lg shadow-lg my-20">
      <h1 className="flex justify-center items-center text-2xl font-bold text-center mb-6 py-0 shadow-md shadow-gray-400">
        My <img src={todolist} alt="logo" className="w-10 h-10" /> Liste
      </h1>

      <Alert show={alert.show} message={alert.message} />

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-4 items-center flex-1">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Nouvelle tâche"
              className="flex-1"
              aria-label="Ajouter une nouvelle tâche"
            />
            <Button rounded onClick={handleSubmit} className="hidden sm:block">
              <img src={add} alt="ajouter logo" className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="danger"
              onClick={deleteCompletedTasks}
              className="w-full sm:w-auto"
            >
              Supp. tâches terminés
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowArchived(!showArchived)}
              className="w-full sm:w-auto"
            >
              {showArchived ? "Tâches principales" : "Tâches archivées"}
            </Button>
          </div>
        </div>
      </div>

      <form className="flex flex-col sm:flex-row items-center sm:items-start gap-4 my-4">
        <RadioButton
          id="checkbox-tous"
          name="statut"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
          label="Tous"
        />
        <RadioButton
          id="checkbox-actives"
          name="statut"
          checked={filter === "active"}
          onChange={() => setFilter("active")}
          label="Actives"
        />
        <RadioButton
          id="checkbox-termines"
          name="statut"
          checked={filter === "completed"}
          onChange={() => setFilter("completed")}
          label="Terminées"
        />
        <Input
          type="text"
          placeholder="Rechercher une tâche"
          className="border rounded ml-auto w-full sm:w-auto"
          onChange={handleSearchChange}
        />
      </form>

      <div className={`my-4 ${showArchived ? "hidden" : ""}`}>
        <SectionTitle>Tâches principales</SectionTitle>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" type="task">
            {(provided, snapshot) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`max-h-60 overflow-y-auto ${
                  snapshot.isDraggingOver ? "bg-gray-50" : ""
                }`}
              >
                {tasks.length === 0 ? (
                  <li>Aucune tâche trouvée.</li>
                ) : (
                  tasks.map((task, index) => (
                    <TodoItem
                      key={task.id}
                      task={task}
                      index={index}
                      onComplete={toggleComplete}
                      onDelete={deleteTask}
                      onEdit={editTask}
                      onArchive={archiveTask}
                    />
                  ))
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className={`my-4 ${!showArchived ? "hidden" : ""}`}>
        <SectionTitle>Tâches archivées</SectionTitle>
        <ul>
          {archivedTasks.length === 0 ? (
            <li>Aucune tâche archivée trouvée.</li>
          ) : (
            archivedTasks.map((task, index) => (
              <TodoItem
                key={task.id}
                task={task}
                index={index}
                onComplete={toggleComplete}
                onDelete={deleteTask}
                onEdit={editTask}
                onArchive={archiveTask}
                isArchived
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
