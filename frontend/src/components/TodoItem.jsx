import PropTypes from "prop-types";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import Button from "../ui/Button.jsx";

const TodoItem = ({
  task,
  index,
  onComplete,
  onDelete,
  onArchive,
  onEdit,
  isArchived = false, // Utiliser un paramètre par défaut
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing && editedText.trim() !== "") {
      onEdit(task.id, editedText);
      setIsEditing(false); // Désactive le mode édition après la soumission
    } else {
      setIsEditing(!isEditing);
    }
  };

  return (
    <>
      {isArchived ? (
        // Rendu pour les tâches archivées (sans Draggable)
        <li
          className={`flex items-center justify-between w-full p-1 my-1 border rounded
          ${task.completed ? "bg-green-50" : ""}`}
        >
          {isEditing ? (
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && editedText.trim() !== "") {
                  handleEdit();
                } else if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditedText(task.text); // Réinitialise le texte
                }
              }}
              onBlur={() => {
                if (editedText.trim() === "") {
                  setIsEditing(false);
                  setEditedText(task.text);
                }
              }}
              autoFocus
              className="flex-1 px-1 py-1 mr-2 border rounded-sm"
            />
          ) : (
            <span
              className={`flex-1 ${
                task.completed ? "line-through bg-green-100/50" : ""
              }`}
            >
              {task.text}
            </span>
          )}

          <div className="flex gap-2 ">
            {!isArchived && (
              <>
                <Button
                  variant="info"
                  onClick={handleEdit}
                  aria-label={
                    isEditing ? "Ajouter modifications" : "Modifier la tâche"
                  }
                >
                  {isEditing ? (
                    <>
                      <i className="fas fa-check" />
                    </>
                  ) : (
                    <>
                      <i className="fas fa-pen-to-square" />
                    </>
                  )}
                </Button>
                <Button
                  variant="success"
                  onClick={() => onComplete(task.id)}
                  aria-label={
                    task.completed ? "Annuler terminer" : "Terminer la tâche"
                  }
                >
                  {task.completed ? (
                    <>
                      <i className="fas fa-undo" />
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check" />
                    </>
                  )}
                </Button>
                <Button variant="danger" onClick={() => onDelete(task.id)}>
                  {/* Supprimer */}
                  <i className="fas fa-trash" />
                </Button>
              </>
            )}
            <Button variant="primary" onClick={() => onArchive(task.id)}>
              {isArchived ? "" : ""}
              <i className="fas fa-box-archive" />
            </Button>
          </div>
        </li>
      ) : (
        // Rendu pour les tâches principales (avec Draggable)
        <Draggable draggableId={task.id.toString()} index={index}>
          {(provided, snapshot) => (
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`flex items-center justify-between w-full p-1 my-1 border rounded
              ${snapshot.isDragging ? "bg-blue-50 shadow-lg" : ""}
              ${task.completed ? "bg-green-50" : ""}`}
              style={{
                ...provided.draggableProps.style,
                cursor: snapshot.isDragging ? "grabbing" : "grab",
              }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editedText.trim() !== "") {
                      handleEdit();
                    } else if (e.key === "Escape") {
                      setIsEditing(false);
                      setEditedText(task.text); // Réinitialise le texte
                    }
                  }}
                  onBlur={() => {
                    if (editedText.trim() === "") {
                      setIsEditing(false);
                      setEditedText(task.text);
                    }
                  }}
                  autoFocus
                  className="flex-1 px-1 py-1 mr-2 border rounded-sm"
                />
              ) : (
                <span
                  className={`flex-1 ${
                    task.completed ? "line-through bg-green-100/50" : ""
                  }`}
                >
                  {task.text}
                </span>
              )}

              <div className="flex gap-2 ">
                {!isArchived && (
                  <>
                    <Button
                      variant="info"
                      onClick={handleEdit}
                      aria-label={
                        isEditing
                          ? "Ajouter modifications"
                          : "Modifier la tâche"
                      }
                    >
                      {isEditing ? (
                        <>
                          <i className="fas fa-check" />
                        </>
                      ) : (
                        <>
                          <i className="fas fa-pen-to-square" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => onComplete(task.id)}
                      aria-label={
                        task.completed
                          ? "Annuler terminer"
                          : "Terminer la tâche"
                      }
                    >
                      {task.completed ? (
                        <>
                          <i className="fas fa-undo" />
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check" />
                        </>
                      )}
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(task.id)}>
                      {/* Supprimer */}
                      <i className="fas fa-trash" />
                    </Button>
                  </>
                )}
                <Button variant="primary" onClick={() => onArchive(task.id)}>
                  {isArchived ? "" : ""}
                  <i className="fas fa-box-archive" />
                </Button>
              </div>
            </li>
          )}
        </Draggable>
      )}
    </>
  );
};

TodoItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isArchived: PropTypes.bool,
  index: PropTypes.number.isRequired,
};

export default TodoItem;
