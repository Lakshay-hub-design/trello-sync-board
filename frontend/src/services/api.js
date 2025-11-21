import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Boards
export const getBoardLists = (boardId) =>
  API.get(`/boards/${boardId}/lists`);

// Tasks (Cards)
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (cardId, data) =>
  API.put(`/tasks/${cardId}`, data);
export const deleteTask = (cardId) =>
  API.delete(`/tasks/${cardId}`);
// List Colors
export const getListColors = (boardId) =>
  API.get(`/boards/${boardId}/list-colors`);

export const updateListColor = (listId, boardId, color) =>
  API.post(`/lists/${listId}/color`, { boardId, color });

// Lists
export const createList = (boardId, name) =>
  API.post(`/lists`, { name, boardId });

export const renameList = (listId, name) =>
  API.put(`/lists/${listId}`, { name });

export const archiveList = (listId) =>
  API.put(`/lists/${listId}/archive`);