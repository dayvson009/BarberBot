const express = require('express')
const bodyParser = require('body-parser')
const {showProducts} = require('./conection/services')

const port = process.env.PORT || 3010
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/**
 * Endpoint para salvar Conversas
 * 
 */

// POST

/**
 * Endpoint para buscar as datas disponivéis do agendamento
 * 
 */

// POST

/**
 * Endpoint para buscar horários disponivéis do agendamento
 * 
 */

// POST

/**
 * Endpoint salvar o agendamento
 * TODO Verificar antes se alguém já escolheu a hora selecionada (evitar duplicidade)
 * 
 */

// POST

/**
 * Endpoint salvar o lembrete
 * 
 */

// POST

/**
 * Endpoint disparar para o cabeleireiro a lista atualizada de agendamentos do dia
 * 
 */

// POST

/**
 * Aplicação para verficiar o status das conversas
 * 
 */

// POST

/**
 * Aplicação dispara o Lembrete, deve rodar a cada 1 minuto
 * 
 */

// POST

showProducts()

app.listen