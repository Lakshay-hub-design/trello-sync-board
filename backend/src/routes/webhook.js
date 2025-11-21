const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/register", async (req, res) => {
  try {
    const { boardId } = req.body;

    const url = "https://api.trello.com/1/webhooks/";

    const response = await axios.post(url, null, {
      params: {
        key: process.env.TRELLO_KEY,
        token: process.env.TRELLO_TOKEN,
        callbackURL: `${process.env.WEBHOOK_BASE_URL}/webhooks/trello`,
        idModel: boardId,
        description: "My Trello Webhook",
      },
    });

    res.json({ success: true, webhook: response.data });
  } catch (err) {
    console.log("Webhook registration error:", err.response?.data);
    res.status(500).json({ error: err.response?.data });
  }
});

router.get("/trello", (req, res) => {
  console.log("Webhook GET verification received");
  res.status(200).send("OK");
});

router.head("/trello", (req, res) => {
  console.log("Webhook HEAD verification received");
  res.status(200).send("OK");
});

router.post("/trello", (req, res) => {

  const action = req.body.action || {};
  const event = {
    type: action.type || "unknown",
    data: action.data || {},
  };

  if (action.type === "updateList" && action.data.list) {
    _io.emit("list:rename", {
      listId: action.data.list.id,
      name: action.data.list.name,
      boardId: action.data.board.id,
    });
  }

  if (action.type === "createCard") {
    _io.emit("card:created", {
      card: action.data.card,
      listId: action.data.list.id,
      boardId: action.data.board.id,
    });
  }

  if (action.type === "updateCard" && action.data.listAfter) {
    _io.emit("card:moved", {
      cardId: action.data.card.id,
      from: action.data.listBefore.id,
      to: action.data.listAfter.id,
      boardId: action.data.board.id,
    });
  }

  if (action.type === "createList") {
    _io.emit("list:created", {
      list: action.data.list,
      boardId: action.data.board.id,
    });
  }

  if (global._io) {
    global._io.emit("trello:event", event);
  }

  res.status(200).send("OK");
});

module.exports = router;
