const express = require('express')

const cors = require('cors')
require("./models/db")
require('dotenv').config()
const app = express()
const port = process.env.port || 3000;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})
