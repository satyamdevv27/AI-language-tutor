const express = require('express')
require("./models/db")
require('dotenv').config()
const app = express()
const port = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})
