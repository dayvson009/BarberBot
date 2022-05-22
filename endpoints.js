const express = require('express')
const func = require('./functionsutil.js')
const db = require('./conection/consultas')
const router = express.Router();

/**
 * Verifica se o cliente já está cadastrado na base
 * e caso não esjeta já salva
 * json=>{nome, whatsapp, dispositivo}
 */
router.post('/verify-client', async (req, res) => {
  const {nome, whatsapp, dispositivo} = req.body
 
  // Verifica se é cliente no banco de dados
  if(await db.verifyClientExist(whatsapp)){
    res.send(true)
  }else{
    db.saveNewClient(req.body)
    res.send(false)
  }
})


/**
 * Endpoint para atualizar dados do cliente
 */
router.post('/update-client', async (req, res) => {
  const {whatsapp, nome} = req.body
  await db.updateClient(whatsapp, nome)
  res.send('atualizando cliente')
})


/**
 * Endpoint para salvar Conversas
 */
router.post('/save-message', async (req, res) => {

  await db.saveMessageChat(req.body)

  res.send("Nova mensagem adicionada")
})

/**
 * Endpoint para salvar a Resposta do dialogFlow na conversa do cliente
 * 
 */
router.post('/save-response', async (req, res) => {
  
  await db.saveResponseMessage(req.body)

  res.send("Resposta da mensagem anterior inserida")
})

/**
 * Endpoint para buscar as datas disponivéis do agendamento
 * pegar só 30 dias
 */
router.get('/get-datas', async (req, res) => {
  
  const agend = await db.getDateAvailable(req.query.whatsapp)
  const funcion = await db.getFuncionamento(req.query.whatsapp)

  const datesLivres = func.datasParaAgendamento(agend, funcion)
  console.log(datesLivres)
  // TODO: Retornar já com a formatação de lista do whatsapp
  res.send(datesLivres)
})

/**
 * Endpoint para buscar horários da data escolhida disponivéis do agendamento
 * 
 */
router.post('/get-hours', async (req, res) => {
  
  const funcionamentoDia = await db.getFuncionamento(req.body.whatsappTo)
  console.log(funcionamentoDia)
  const hoursDay = await db.getDayAvailable(req.body)
  console.log(hoursDay)

  const hourLivre = func.horasDisponiveisDoDia(funcionamentoDia[0],hoursDay)
  console.log(hourLivre)

  res.send(hourLivre)
})

/**
 * Endpoint salvar o agendamento
 * TODO Verificar antes se alguém já escolheu a hora selecionada (evitar duplicidade)
 * 
 */
router.post('/save', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint salvar o lembrete
 * 
 */
router.post('/add-reminder', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Endpoint disparar para o cabeleireiro a lista atualizada de agendamentos do dia
 * 
 */
router.post('/send-list-scheduling', async (req, res) => {
  
  res.send("Pegou")
})

/**
 * Aplicação para verficiar o status das conversas
 * 
 */

module.exports = router