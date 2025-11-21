const express = require('express')
const router = express.Router()
const listsController = require('../controllers/lists.controller')

router.put("/:listId", listsController.renameList)
router.post("/", listsController.createList);
router.put("/:listId/archive", listsController.archiveList);

module.exports = router