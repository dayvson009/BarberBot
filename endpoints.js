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

  const msgCliente = await db.verifyClientExist(whatsapp)
 
  // Verifica se é cliente no banco de dados
  if(msgCliente.length > 0){
    res.send(msgCliente[0].nome)
  }else{
    db.saveNewClient(req.body)
    res.send(false)
  }
})

/**
 * Pega o nome da Barbearia
 */
router.get('/get-barber', async (req, res) => {
 
  const barbearia = await db.getBarber(req.query.barber)

  console.log(barbearia)
  console.log(barbearia[0].nomebarbearia)
  
  res.send(barbearia[0].nomebarbearia)
  
})


/**
 * Endpoint para atualizar dados do cliente
 */
router.post('/update-client', async (req, res) => {
  const {whatsappTo, nome} = req.body
  await db.updateClient(whatsappTo, nome)
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
 * Endpoint os serviços com preços
 */
router.post('/show-services', async (req, res) => {
  
  let {whatsappTo, mensagem} = req.body

  console.log(req.body)

  const services = await db.getServicesPrices(whatsappTo)

  const list = {
    type : "list"
    ,listContent : services.map(item => item.nomeservico).join('\n')
    ,listAction : "Escolha uma opção 👈"
    ,listItens : [{title:"Escolha uma opção abaixo", rows:[]}]
    ,listTitle : ""
    ,listFooter : "Selecione um item"
  }

  list.listItens[0].rows = ['Voltar ao menu Principal', 'Sair'].map(item => ({title:item, description: ""}))

  console.log(list)

  console.log("Enviando Lista", new Date())

  res.send(list)
})

/**
 * Endpoint para buscar os serviços oferecidos
 */
router.post('/get-services', async (req, res) => {
  
  let {whatsappTo, mensagem} = req.body

  console.log(req.body)

  const services = await db.getServices(whatsappTo)

  const list = {
    type : "list"
    ,listContent : mensagem
    ,listAction : "Escolha um serviço 👈"
    ,listItens : [{title:"Escolha um serviço abaixo", rows:[]}]
    ,listTitle : ""
    ,listFooter : "Selecione um item"
  }

  list.listItens[0].rows = services.map(item => ({title:item.nomeservico, description: ""}))

  console.log(list)

  console.log("Enviando Lista", new Date())

  res.send(list)
})


/**
 * Endpoint para buscar as datas disponivéis do agendamento
 * pegar só 30 dias
 */
router.post('/get-datas', async (req, res) => {
  
  let {whatsappTo, mensagem} = req.body

  console.log(req.body)

  const agend = await db.getDateFree(whatsappTo)
  const funcion = await db.getFuncionamento(whatsappTo)

  const datasLivres = func.datasParaAgendamento(agend, funcion)
  console.log(datasLivres)

  const list = {
    type : "list"
    ,listContent : mensagem
    ,listAction : "Escolha a Data aqui 📅 👈"
    ,listItens : [{title:"Escolha uma data abaixo", rows:[]}]
    ,listTitle : ""
    ,listFooter : "Selecione um item"
  }

  list.listItens[0].rows = datasLivres.map(item => ({title:item.data, description: ""}))

  console.log(list)

  console.log("Enviando Lista", new Date())

  res.send(list)
})


/**
 * Endpoint para buscar horários da data escolhida disponivéis do agendamento
 * 
 */
router.post('/get-hours', async (req, res) => {
    
  const funcionamentoDia = await db.getFuncionamento(req.body.whatsappTo)
  const hoursDay = await db.getDayHoursFree(req.body)
  const msg = req.body.mensagem
  const hourLivre = func.horasDisponiveisDoDia(funcionamentoDia[0],hoursDay)
  console.log(hourLivre)

  const list = {
    type : "list"
    ,listContent : msg
    ,listAction : "Escolha a Hora aqui ⏱ 👈"
    ,listItens : [{title:"Escolha uma data abaixo", rows:[]}]
    ,listTitle : ""
    ,listFooter : "Selecione um item"
  }

  list.listItens[0].rows = hourLivre.map(item => ({title:item, description: ""}))

  res.send(list)
})

/**
 * Endpoint salvar o agendamento
 * TODO Verificar antes se alguém já escolheu a hora selecionada (evitar duplicidade)
 * 
 */
router.post('/save-date-time-appointment', async (req, res) => {
  
  const free = await db.verifyDateHoursFree(req.body)

  let appointment = 'Hora não disponível, por favor selecione outro horário'
  
  if(free.length == 0){
    const retorno = await db.saveDateTimeAppointment(req.body)

    appointment = 'OK'

    // Verifica se a data Agendada é igual ao dia atual Envia mensagem para o barbeiro com a lista atualizada do dia atual
    if(func.verifyCurrentDate(req.body.data))
      func.refresListBarber(req.body.whatsappTo)
  }
  
  res.send(appointment)
})


/**
 * Endpoint salvar o lembrete
 */
router.post('/reminder-me', async (req, res) => {
  const getHourReminder = func.getHourReminder(req.body)
  
  await db.insertReminderMe(req.body,getHourReminder)
  res.send("Seu lembrete foi agendado às "+ getHourReminder)
})

/**
 * Endpoint disparar para o cabeleireiro a lista atualizada de agendamentos do dia
 */
router.post('/send-list-scheduling', async (req, res) => res.send(await func.refresListBarber(req.body.whatsappTo)))


/**
 * Aplicação para verficiar o status das conversas
 * 
 */

module.exports = router