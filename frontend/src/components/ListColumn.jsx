import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import CardList from "./CardList";
import AddCardInput from "../components/AddCardInput";
import ListMenu from "./ListMenu";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function ListColumn({
  list,
  listColors,
  editingList,
  tempListName,
  setEditingList,
  setTempListName,
  toggleMenu,
  activeListMenu,
  handleRenameList,
  handleSetListColor,
  activeAddInput,
  inputRefs,
  newCardName,
  setNewCardName,
  handleAddCard,
  lightenColor,
  fetchLists,
  setActiveAddInput,
  setActiveListMenu,
  onArchiveList
}) {
  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { listId: list.id },
  });

  return (
    <div
      className="list"
      ref={setNodeRef}
      style={{ background: listColors[list.id] || "#1e1f22" }}
    >
      {/* POPUP MENU */}
      {activeListMenu === list.id && (
        <ListMenu
          listId={list.id}
          colors={[
            "#5e60ce",
            "#4cc9f0",
            "#4361ee",
            "#f72585",
            "#ff9e00",
            "#2ecc71",
          ]}
          onAddCard={() => {
            setActiveAddInput(list.id);
            setActiveListMenu(null);
          }}
          onArchiveList={() => onArchiveList(list.id)} 
          onSetColor={(c) => handleSetListColor(list.id, c)}
          onRemoveColor={() => handleSetListColor(list.id, null)}
          onClose={() => toggleMenu({ stopPropagation() {} }, null)}
        />
      )}

      {/* HEADER */}
      <div className="list-header">
        {editingList === list.id ? (
          <input
            className="list-title-input"
            autoFocus
            value={tempListName}
            onChange={(e) => setTempListName(e.target.value)}
            onBlur={() => handleRenameList(list.id)}
            onKeyDown={(e) => e.key === "Enter" && handleRenameList(list.id)}
            style={{
              color: listColors[list.id]
                ? lightenColor(listColors[list.id], 75)
                : "#fff",
            }}
          />
        ) : (
          <h3
            className="list-title"
            style={{
              color: listColors[list.id]
                ? lightenColor(listColors[list.id], 75)
                : "#fff",
            }}
            onClick={() => {
              setEditingList(list.id);
              setTempListName(list.name);
            }}
          >
            {list.name}
          </h3>
        )}

        <button
          className="list-menu-btn"
          onClick={(e) => toggleMenu(e, list.id)}
        >
          ⋯
        </button>
      </div>

      {/* CARDS */}
      <SortableContext
        items={list.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <CardList
          list={list}
          listColors={listColors}
          lightenColor={lightenColor}
          fetchLists={fetchLists}
        />
      </SortableContext>

      {/* ADD CARD INPUT */}
      <AddCardInput
        list={list}
        listColors={listColors}
        activeAddInput={activeAddInput}
        inputRefs={inputRefs}
        newCardName={newCardName}
        setNewCardName={setNewCardName}
        handleAddCard={handleAddCard}
        lightenColor={lightenColor}
      />
    </div>
  );
}
