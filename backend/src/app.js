const express = require('express')
const app = express()
const cors = require('cors')
const tasksRoutes = require('../src/routes/tasks')
const boardRoutes = require('../src/routes/boards')
const webhooksRoutes = require('../src/routes/webhook')
const listColorsRoutes = require('../src/routes/listColors')
const listRoutes = require('../src/routes/lists')

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{
    res.send("jai shree ram")
})

app.use('/api/tasks', tasksRoutes)
app.use('/api/boards', boardRoutes)
app.use('/webhooks', webhooksRoutes)
app.use('/api', listColorsRoutes);
app.use('/api/lists', listRoutes)

module.exports = app