const express = require('express')
const port = process.env.PORT || 3030
const bodyParser = require('body-parser')
const cors = require('cors')
var app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

require('./routes/df-routes.js')(app)

app.get('/df/server', (req, res)=>{
    res.send("Olá Mundo DialogFlow")
})

app.listen(port, () =>console.log("Servidor funcionando na porta "+port))