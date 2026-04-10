const express = require('express')
const http = require('http')
const path = require('path')
const fs = require('fs')

const app = express()

const port = process.env.PORT || 4200

app.use(express.static(path.join(__dirname, '../dist/ngx-version-check/browser')))

app.get('/{*any}', (req, res) =>
  res.sendFile('index.html', { root: path.join(__dirname, '../dist/ngx-version-check/browser') })
)

http.createServer(app).listen(port, () => {
  console.log(`Running on http://localhost:${port}`)
})
