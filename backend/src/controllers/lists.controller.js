const trelloRequest = require('../utils/trello')
async function renameList(req, res) {
    try {
    const { listId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const updated = await trelloRequest("PUT", `/lists/${listId}`, { name });

    res.json({ success: true, list: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Rename failed" });
  }
}

async function createList (req, res){
  try {
    const { boardId, name } = req.body;
    if (!name || !boardId) {
      return res
        .status(400)
        .json({ success: false, message: "name and boardId are required" });
    }

    const list = await trelloRequest("POST", "/lists", {
      name,
      idBoard: boardId,
      pos: "bottom"
    });

    res.json({ success: true, list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, err });
  }
};

async function archiveList (req, res){
  try {
    const { listId } = req.params;

    const result = await trelloRequest(
      "PUT",
      `/lists/${listId}/closed`,
      { value: true }
    );

    res.json({ success: true, message: "List archived", result });
  } catch (err) {
    console.log("Archive error:", err);
    res.status(500).json({ success: false, message: "Archive failed", err });
  }
};

module.exports = {
    renameList,
    createList,
    archiveList
}