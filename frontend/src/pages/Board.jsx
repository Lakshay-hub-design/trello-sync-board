import React, { useEffect, useState, useRef } from "react";
import {
  getBoardLists,
  createTask,
  updateTask,
  getListColors,
  updateListColor,
  renameList,
  createList,
  archiveList
} from "../services/api";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

import BoardNavbar from "../components/BoardNavbar";
import ListColumn from "../components/ListColumn";
import AddListButton from "../components/AddListButton";
import "../styles/board.css";
import CardItem from "../components/CardItem";

const BOARD_ID = "691ac15354f26bab4a525187";

export default function Board() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [listColors, setListColors] = useState({});
  const [editingList, setEditingList] = useState(null);
  const [tempListName, setTempListName] = useState("");

  const [activeListMenu, setActiveListMenu] = useState(null);

  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [activeAddInput, setActiveAddInput] = useState(null);

  const [newCardName, setNewCardName] = useState({});
  const inputRefs = useRef({});

  const [boardName, setBoardName] = useState("");

  const socket = io("http://localhost:4000");

  // FETCH BOARD + COLORS
  const fetchLists = async () => {
    try {
      const res = await getBoardLists(BOARD_ID);

      setLists(res.data.lists);

      if (res.data.board?.name) setBoardName(res.data.board.name);
      else if (res.data.boardName) setBoardName(res.data.boardName);
    } catch (err) {
      toast.error("Failed to load board");
    }
  };

  useEffect(() => {
    fetchLists().then(() => setInitialLoad(false));

    (async () => {
      try {
        const res = await getListColors(BOARD_ID);
        if (res.data.colors) setListColors(res.data.colors);
      } catch {}
    })();
  }, []);

  const handleRenameList = async (listId) => {
    if (!tempListName.trim()) {
      setEditingList(null);
      return;
    }

    await renameList(listId, tempListName.trim());

    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, name: tempListName } : l))
    );

    setEditingList(null);
    fetchLists();
  };

  // SOCKET UPDATES
  useEffect(() => {
    const onTrelloEvent = (event) => {
      console.log("Received event from trello:", event);
      fetchLists();
    };

    const onListColorUpdated = ({ boardId, listId, color }) => {
      if (boardId !== BOARD_ID) return;
      setListColors((prev) => {
        const next = { ...prev };
        if (color) next[listId] = color;
        else delete next[listId];
        return next;
      });
    };

    const onListRename = ({ listId, name, boardId }) => {
      if (boardId !== BOARD_ID) return;
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, name } : l))
      );
    };

    socket.on("trello:event", onTrelloEvent);
    socket.on("list:color.updated", onListColorUpdated);
    socket.on("list:rename", onListRename);

    return () => {
      socket.off("trello:event", onTrelloEvent);
      socket.off("list:color.updated", onListColorUpdated);
      socket.off("list:rename", onListRename);
    };
  }, []);

  // AUTO-FOCUS NEW CARD INPUT
  useEffect(() => {
    if (activeAddInput && inputRefs.current[activeAddInput]) {
      inputRefs.current[activeAddInput].focus();
    }
  }, [activeAddInput]);

  // DRAG HANDLER
  const sortCardsInsideSameList = (listId, activeCardId, overCardId) => {
    setLists((prev) => {
      return prev.map((list) => {
        if (list.id !== listId) return list;

        const oldIndex = list.cards.findIndex((c) => c.id === activeCardId);
        const newIndex = list.cards.findIndex((c) => c.id === overCardId);

        return {
          ...list,
          cards: arrayMove(list.cards, oldIndex, newIndex),
        };
      });
    });
  };

  const moveCardToAnotherList = (fromListId, toListId, cardId, overCardId) => {
    setLists((prev) => {
      const newLists = JSON.parse(JSON.stringify(prev));

      const fromList = newLists.find((l) => l.id === fromListId);
      const toList = newLists.find((l) => l.id === toListId);

      const cardIndex = fromList.cards.findIndex((c) => c.id === cardId);
      const [movedCard] = fromList.cards.splice(cardIndex, 1);

      // Insert at correct index inside destination list
      const overIndex = toList.cards.findIndex((c) => c.id === overCardId);
      const insertIndex = overIndex === -1 ? toList.cards.length : overIndex;

      toList.cards.splice(insertIndex, 0, movedCard);

      // Update backend
      updateTask(cardId, { idList: toListId }).catch(() => {
        toast.error("Move failed — reverting");
        fetchLists();
      });

      return newLists;
    });
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveCard(active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    // If card is dropped in same position → do nothing
    if (active.id === over.id) return;

    const activeListId = active.data.current.listId;
    const overListId = over.data.current.listId;

    if (activeListId === overListId) {
      // reorder in same list
      sortCardsInsideSameList(activeListId, active.id, over.id);
    } else {
      // move card to another list
      moveCardToAnotherList(activeListId, overListId, active.id, over.id);
    }

    setActiveCard(null);
  };

  // ADD NEW CARD
  const handleAddCard = async (listId) => {
  const name = (newCardName[listId] || "").trim();
  if (!name) return toast.error("Enter card title");

  const tempId = `temp-${Date.now()}`;
  const tempCard = { id: tempId, name, desc: "" };
  setLists((prev) =>
    prev.map((l) =>
      l.id === listId ? { ...l, cards: [tempCard, ...l.cards] } : l
    )
  );
  setNewCardName((prev) => ({ ...prev, [listId]: "" }));

  try {
    const res = await createTask({ listId, name, desc: "" });

    const realCard = res.data.card;
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;

        return {
          ...list,
          cards: list.cards.map((c) => (c.id === tempId ? realCard : c)),
        };
      })
    );

  } catch (err) {
    console.log(err);
    toast.error("Add failed");

    // Remove temp card
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((c) => c.id !== tempId) }
          : list
      )
    );
  }
};


  // ADD NEW LIST
  const handleAddList = async () => {
    if (!newListName.trim()) return;

    try {
      const res = await createList(BOARD_ID, newListName);

      const newList = { ...res.data.list, cards: [] };
      setLists((prev) => [...prev, newList]);
      setAddingList(false);
      setNewListName("");
    } catch {
      toast.error("Failed to add list");
    }
  };

  // ARCHIVE LIST
const handleArchiveList = async (listId) => {
  setLists(prev => prev.filter(l => l.id !== listId));

  try {
    await archiveList(listId);
    toast.success("List archived");
  } catch (err) {
    toast.error("Failed to archive");
    fetchLists();
  }
};

  // UI HELPERS
  const toggleMenu = (e, listId) => {
    e.stopPropagation();
    setActiveListMenu(activeListMenu === listId ? null : listId);
  };

  const handleSetListColor = async (listId, color) => {
    setListColors((prev) => ({ ...prev, [listId]: color })); // optimistic
    setActiveListMenu(null);

    try {
      await updateListColor(listId, BOARD_ID, color);
    } catch (err) {
      toast.error("Failed to save color");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveListMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const lightenColor = (hex, percent = 45) => {
    if (!hex) return "#fff";
    hex = hex.replace("#", "");
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);

    r = Math.min(255, r + ((255 - r) * percent) / 100);
    g = Math.min(255, g + ((255 - g) * percent) / 100);
    b = Math.min(255, b + ((255 - b) * percent) / 100);

    return `rgb(${r}, ${g}, ${b})`;
  };


  return (
    <div className="board-container">
      <BoardNavbar boardName={boardName || "Loading..."} />

      <div className="board">
        {initialLoad && (
          <div style={{ display: "flex", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ width: 260 }}>
                <div
                  className="skeleton"
                  style={{ height: 24, width: 120, marginBottom: 12 }}
                />
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="skeleton" style={{ height: 48 }} />
                ))}
              </div>
            ))}
          </div>
        )}

        {!loading && lists.length === 0 && (
          <div className="empty">
            No lists found. Create a board with default lists or add lists in
            Trello.
          </div>
        )}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="lists-row">
            {/* ALL LISTS */}
            {!initialLoad &&
              lists.map((list) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  listColors={listColors}
                  editingList={editingList}
                  tempListName={tempListName}
                  setEditingList={setEditingList}
                  setTempListName={setTempListName}
                  handleRenameList={handleRenameList}
                  toggleMenu={toggleMenu}
                  activeListMenu={activeListMenu}
                  setActiveListMenu={setActiveListMenu}
                  handleSetListColor={handleSetListColor}
                  lightenColor={lightenColor}
                  newCardName={newCardName}
                  setNewCardName={setNewCardName}
                  handleAddCard={handleAddCard}
                  inputRefs={inputRefs}
                  activeAddInput={null}
                  fetchLists={fetchLists}
                  setActiveAddInput={setActiveAddInput}
                  onArchiveList={handleArchiveList}
                />
              ))}

            {/* ADD LIST BUTTON */}
            {!initialLoad && (
              <AddListButton
                addingList={addingList}
                setAddingList={setAddingList}
                newListName={newListName}
                setNewListName={setNewListName}
                handleAddList={handleAddList}
              />
            )}
          </div>
          <DragOverlay>
            {activeCard ? (
              <div className="drag-overlay-card">
                <CardItem card={activeCard.card} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
