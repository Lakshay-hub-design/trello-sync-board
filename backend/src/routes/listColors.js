const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_FILE = path.join(__dirname, '../../data/listColors.json');

// helpers
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '{}');
  } catch {
    return {};
  }
}
function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

router.get('/boards/:boardId/list-colors', (req, res) => {
  const { boardId } = req.params;
  const all = readData();
  res.json({ success: true, colors: all[boardId] || {} });
});

router.post('/lists/:listId/color', (req, res) => {
  try {
    const { listId } = req.params;
    const { boardId, color } = req.body;
    if (!boardId) return res.status(400).json({ success:false, message:"boardId required" });

    const all = readData();
    all[boardId] = all[boardId] || {};
    if (color) {
      all[boardId][listId] = color;
    } else {
      delete all[boardId][listId];
    }
    writeData(all);

    if (global._io) {
      global._io.emit('list:color.updated', { boardId, listId, color });
    }

    res.json({ success: true, colors: all[boardId] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: "server error" });
  }
});

module.exports = router;
