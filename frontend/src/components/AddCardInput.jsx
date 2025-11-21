import React from "react";

export default function AddCardInput({
  list,
  listColors,
  activeAddInput,
  inputRefs,
  newCardName,
  setNewCardName,
  handleAddCard,
  lightenColor,
}) {
  return (
    <div className="list-controls">
      <input
        className="dynamic-input dynamic-placeholder"
        style={{
          "--placeholder-color": listColors[list.id]
            ? lightenColor(listColors[list.id], 70) 
            : "#bfbfbf",
          "--input-border-color": listColors[list.id]
            ? lightenColor(listColors[list.id], 30) 
            : "#444",

          "--input-border-focus": listColors[list.id]
            ? lightenColor(listColors[list.id], 50) 
            : "#888",
          color: listColors[list.id]
            ? lightenColor(listColors[list.id], 65)
            : "#fff",
        }}
        ref={(el) => (inputRefs.current[list.id] = el)}
        placeholder="New card"
        value={newCardName[list.id] || ""}
        onChange={(e) =>
          setNewCardName((prev) => ({
            ...prev,
            [list.id]: e.target.value,
          }))
        }
      />

      <button
        className="add-card-btn"
        onClick={() => handleAddCard(list.id)}
        style={{
          background: listColors[list.id]
            ? lightenColor(listColors[list.id], 55)
            : "#222326",
          color: listColors[list.id]
            ? lightenColor(listColors[list.id], 10)
            : "#fff",
          "--hover-bg": listColors[list.id]
            ? lightenColor(listColors[list.id], 70)
            : "#333437ff",
        }}
      >
        Add
      </button>
    </div>
  );
}
