const express = require('express')
const bodyParser = require('body-parser')
const db = require('./conection/consultas')
const endpoint = require('./endpoints.js')

const port = process.env.PORT || 3010
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/',endpoint)

// db.verifyClientExist()

app.listen(port, console.log("Aplicação Rodando na porta ", port))