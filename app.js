const express = require('express')
const bodyParser = require('body-parser')
const {showProducts} = require('./conection/services')

const port = process.env.PORT || 3010
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/**
 * Endpoint para Verificar se já é cliente
 * 
 */
app.post('/save-message', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint para salvar Conversas
 * 
 */
app.post('/save-message', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint para buscar as datas disponivéis do agendamento
 * pegar só 30 dias
 */
app.post('/get-datas', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint para buscar horários da data escolhida disponivéis do agendamento
 * 
 */
app.post('/get-hours', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint salvar o agendamento
 * TODO Verificar antes se alguém já escolheu a hora selecionada (evitar duplicidade)
 * 
 */
app.post('/save', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint salvar o lembrete
 * 
 */
app.post('/add-reminder', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint disparar para o cabeleireiro a lista atualizada de agendamentos do dia
 * 
 */
app.post('/send-list-scheduling', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Aplicação para verficiar o status das conversas
 * 
 */
const updateStatusMessages = () => {
  console.log('cuidado ao olhar pra cima')
}

/**
 * Aplicação dispara o Lembrete, deve rodar a cada 1 minuto
 * 
 */
const verifyTimeScheduling = () => {
  console.log("Se houver lembretes agendados envia um chatbot paa o cliente")
}

showProducts()

app.listen(port, console.log("Aplicação Rodando na porta ", port))