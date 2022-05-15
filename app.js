const express = require('express')
const bodyParser = require('body-parser')
const {showProducts} = require('./conection/services')

const port = process.env.PORT || 3010
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


showProducts()

app.listen