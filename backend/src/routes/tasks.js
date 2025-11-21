const express = require("express");
const router = express.Router();
const tasksController = require('../controllers/tasks.controller')

router.post('/', tasksController.createTask)
router.put('/:cardId', tasksController.updateTask)
router.delete('/:cardId', tasksController.deleteTask)

module.exports = router