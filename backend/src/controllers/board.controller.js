const trelloRequest = require('../utils/trello')

async function createBoard(req, res){
  try {
    const { name, defaultLists = true } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "name is required" });
    }

    const result = await trelloRequest("POST", "/boards", {
      name,
      defaultLists
    });

    res.json({ success: true, board: result });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function getBoardLists(req, res) {
  try {
    const { boardId } = req.params;

    const board = await trelloRequest(
      "GET",
      `/boards/${boardId}`,
      { fields: "name" }
    );

    const lists = await trelloRequest(
      "GET",
      `/boards/${boardId}/lists`,
      {
        cards: "all",
        card_fields: "all",
        _timestamp: Date.now()
      }
    );

    res.json({ 
      success: true,
      lists,
      boardName: board.name,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}



module.exports = {
  createBoard,
  getBoardLists
}