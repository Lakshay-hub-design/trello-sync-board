import React from "react";
import "remixicon/fonts/remixicon.css";

export default function ListMenu({
  listId,
  colors = [],
  onAddCard,
  onSetColor,
  onRemoveColor,
  onArchiveList,
  onClose,
}) {
  return (
    <div className="list-menu-popup" onClick={(e) => e.stopPropagation()}>
      <button className="list-menu-close" onClick={onClose} aria-label="Close">
        <i className="ri-close-line"></i>
      </button>

      <h3 className="list-menu-head">List actions</h3>

      <div
        className="menu-item"
        onClick={(e) => {
          e.stopPropagation();
          onAddCard();
        }}
      >
        ➕ Add card
      </div>

      <div className="menu-section-title">Change list color</div>

      <div className="color-row">
        {colors.map((c) => (
          <button
            key={c}
            className="color-dot-btn"
            title={c}
            onClick={(e) => {
              e.stopPropagation();
              onSetColor(c);
            }}
            style={{ background: c }}
            aria-label={`Set color ${c}`}
          />
        ))}
      </div>

      <div
        className="menu-item"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveColor();
        }}
      >
        ✖ Remove color
      </div>
      <div className="menu-item" onClick={() => onArchiveList(listId)}>
        <i className="ri-archive-stack-line" style={{ marginRight: 6 }}></i>
        Archive this list
      </div>
    </div>
  );
}
