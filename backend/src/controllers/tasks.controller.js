const trelloRequest = require('../utils/trello')

async function createTask (req, res) {
  try {
    const { listId, name, desc } = req.body;

    if (!listId || !name) {
      return res.status(400).json({ success: false, message: "listId and name are required" });
    }

    const result = await trelloRequest("POST", "/cards", {
      idList: listId,
      name,
      desc
    });

    res.json({ success: true, card: result });
  } catch (err) {
    res.status(500).json(err);
  }
};

async function updateTask(req, res) {
  try {
    const { cardId } = req.params;
    const updateData = req.body;

    if (!cardId) {
      return res.status(400).json({ success: false, message: "cardId required" });
    }

    const result = await trelloRequest("PUT", `/cards/${cardId}`, {}, updateData);

    res.json({ success: true, card: result });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function deleteTask(req, res) {
  try {
    const { cardId } = req.params;

    const result = await trelloRequest(
      "DELETE",
      `/cards/${cardId}`,
      {},
      { closed: true }
    );

    res.json({ success: true, card: result });
  } catch (err) {
    res.status(500).json(err);
  }
}


module.exports ={
    createTask,
    updateTask,
    deleteTask
}