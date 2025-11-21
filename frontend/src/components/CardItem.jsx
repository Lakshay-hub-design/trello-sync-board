import { useState, useRef } from "react";
import { deleteTask, updateTask } from "../services/api";
import { toast } from "react-toastify";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "remixicon/fonts/remixicon.css";
import "../styles/carditem.css";

export default function CardItem({ card, listId, fetchLists }) {
  const parseDesc = () => {
    try {
      return JSON.parse(card.desc || "{}");
    } catch {
      return {};
    }
  };

  const initialMeta = parseDesc();
  const [completed, setCompleted] = useState(initialMeta.completed || false);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(card.name);
  const hoverRef = useRef(null);

  const saveEdit = async () => {
    if (!tempName.trim()) return toast.error("Name cannot be empty");

    card.name = tempName;
    setEditing(false);
    fetchLists();

    try {
      await updateTask(card.id, { name: tempName });
      toast.success("Card renamed");
    } catch {
      toast.error("Failed to update");
    }
  };

  const toggleComplete = async () => {
    const newState = !completed;
    setCompleted(newState);

    try {
      await updateTask(card.id, {
        desc: JSON.stringify({ completed: newState }),
      });
      fetchLists();
    } catch {
      toast.error("Could not update");
      setCompleted(!newState);
    }
  };

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: card.id,
      data: { card, listId },
    });

  const stopDrag = (e) => e.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`card-wrapper ${isDragging ? "dragging" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
      }}
    >
      <div className="card-inner">
        {editing ? (
          <div className="edit-mode">
            <input
              className="edit-input"
              value={tempName}
              autoFocus
              onChange={(e) => setTempName(e.target.value)}
              onPointerDown={stopDrag}
              onMouseDown={stopDrag}
              onTouchStart={stopDrag}
            />

            <div className="edit-actions">
              <button
                className="btn-save"
                onClick={saveEdit}
                ref={hoverRef}
                onPointerDown={stopDrag}
              >
                Save
              </button>

              <button
                className="btn-cancel"
                onClick={() => setEditing(false)}
                ref={hoverRef}
                onPointerDown={stopDrag}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            <div className="left-content">
              <label
                className="circle-checkbox card-actions"
                onPointerDown={stopDrag}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={toggleComplete}
                />
                <span className="checkmark"></span>
                <span className="tooltip-text">
                  {completed ? "Mark as incomplete" : "Mark as complete"}
                </span>
              </label>

              <span className="card-title">{card.name}</span>
            </div>

            <div className="card-actions buttons">
              <button
                className="btn-icon"
                onPointerDown={stopDrag}
                onClick={() => setEditing(true)}
              >
                <i className="ri-edit-box-line"></i>
              </button>

              <button
                className="btn-icon delete"
                onPointerDown={stopDrag}
                onClick={async () => {
                  await deleteTask(card.id);
                  toast.success("Card deleted");
                  fetchLists();
                }}
              >
                <i className="ri-delete-bin-6-line"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
