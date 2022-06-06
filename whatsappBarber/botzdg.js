const { Client, List, Buttons, MessageMedia, Contact, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
// const qrcode = require('qrcode');
const qrcode = require('qrcode-terminal');
const http = require('http');
const https = require('https');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mime = require('mime-types');
const port = process.env.PORT || 3020;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const httpAgent = new http.Agent({keepAlive: true});
const httpsAgent = new https.Agent({keepAlive: true});

const URL_BARBERBOT = 'http://10.0.0.100:3010'
const URL_DIALOGFLOW = 'http://10.0.0.100:3030'

app.use(express.json());
app.use(express.urlencoded({
extended: true
}));
app.use(fileUpload({
debug: true
}));
app.use("/", express.static(__dirname + "/"))

// app.get('/', (req, res) => {
//   res.sendFile('index.html', {
//     root: __dirname
//   });
// });

const client = new Client({
  // authStrategy: new LocalAuth({ clientId: 'BarberBot' }),
  puppeteer: { headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ] }
});

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('zapdasgalaxias.com.br BarberBot QRCode recebido', qr);
});

client.on('authenticated', () => {
    console.log('zapdasgalaxias.com.br BarberBot Autenticado');
});

client.on('auth_failure', msg => {
    console.error('zapdasgalaxias.com.br BarberBot Falha na autenticação', msg);
});

client.on('ready', () => {
    console.log('zapdasgalaxias.com.br BarberBot Dispositivo pronto');
});

client.on('change_state', state => {
    console.log('zapdasgalaxias.com.br BarberBot Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
    console.log('zapdasgalaxias.com.br BarberBot Cliente desconectado', reason);
});


/** ----------------- INICIO MEU CÓDIGO --------------- DV
 * String.prototype Cria um Metodo de uma String
 * A função é chamada da seguinte maneira: string.funcao(param)
 * Nesta função ele da um split em tags e retorna o conteúdo de dentro
 */


// Talvez não vamos precisar disso, mas deixa aqui - serve para remover quebra de linhas e substitui por §
const textOneLine = text => text.replace(/(\r\n|\n|\r)/gm, "§")
// Aqui faz o inverso pega tudo que tiver § e quebra linha, foi uma gambiarra que fiz rsrsrs
const textBreakLine = text => text.replace(/(§§|§|§§§)/gm, "\r\n")

/**
 * Verifica se um número possui whatsapp ou não
 * @param {string} number 
 * @returns Bolean
 */
 const checkRegisteredNumber = async function(number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
}

/**
 * EndPoint pra enviar mensagens
 * @param {object} {[}'558184319706', '558100112233']
 */
app.post('/send-message', async (req, res) => {
  console.log(req.body)
  client.sendMessage(phoneNumberFormatter(req.body.whatsapp), req.body.message)
})

/**
 * EndPoint pra verificar se o número existe ou não
 * @param {array} ['558184319706', '558100112233']
 * @return Objeto
 */
app.post('/exist-number', async (req, res) => {
  const registrado = []
  const naoRegistrado = []

  for await (number of req.body) {
    console.log("Checando numero: "+number)
    if(number)
      await checkRegisteredNumber(number) ? registrado.push(number) : naoRegistrado.push(number);
    else
      naoRegistrado.push(number)
  }
  res.send({"registrado":registrado, "naoRegistrado": naoRegistrado})
})

const phoneNumberFormatter = number => {
  number = number.split('@')[0]
  pais = number.substr(0,2)
  ddd = number.substr(2,2)
  numero = number.substr(-8,8)

  return ddd.toString() <= '30' ? `55${ddd}9${numero}@c.us` : `55${ddd}${numero}@c.us`;
}

const getContentTag = (msg, tag) => {
  let content = msg.split(`<${tag}>`).slice(1)
  content = content.map(item => item.split(`</${tag}>`)[0])
  return content.length > 1 ? content : content[0]
}

/**
 * Sleep é uma função para dar um pause temporário
 */
const sleep = (ms) => new Promise((resolve)=>setTimeout(resolve, ms))

/**
 * Aqui Envia a mensagem para o DialogFlow, e Retorna a resposta do mesmo
 */
const sendDialogFlow = async (mensagem, numero) => {

  const body = {
    "text": mensagem,
    "userId": numero
  }
  
  const resp = await axios.post(`${URL_DIALOGFLOW}/text_query`, body, { httpAgent })
  
  return resp.data

}

const requestGET = async (msg) => {

  const urlGet = getContentTag(msg,'GET')

  let message = await axios.get(urlGet, { httpAgent });
  message = message.data
  
  console.log(message)
  console.log("Enviando GET", new Date())

  if (message.type == "list"){
    
    let {type,listContent,listAction,listItens,listTitle,listFooter} = message

    message = new List(listContent,listAction,listItens,listTitle,listFooter);
  }else{
    message = ''
  }

  return message

}

const requestPOST = async (msg,whatsappFrom, whatsappTo) => {

  const urlPost = getContentTag(msg,'POST')
  const dataPost = JSON.parse(getContentTag(msg,'POSTDATA'))

  Object.assign(dataPost,{"whatsappFrom": whatsappFrom})
  Object.assign(dataPost,{"whatsappTo": whatsappTo})

  let message = await axios.post(urlPost, dataPost, { httpAgent });
  message = message.data

  if (message.type == "list"){
    
    let {type,listContent,listAction,listItens,listTitle,listFooter} = message

    message = new List(listContent,listAction,listItens,listTitle,listFooter);
  }
  
  console.log("MENSAGEM POST A ENIAR", message)
  console.log("Enviando POST", new Date())

  return message

}

/**
 * Função para criar botão de whatsapp
 */
const sendButton = async (msg) => {

  const buttonContent = getContentTag(msg,'BUTTONCONTENT')
  const buttonTitle = getContentTag(msg,'BUTTONTITLE') || ""
  const buttonFooter = getContentTag(msg,'BUTTONFOOTER') || ""
  const buttons = getContentTag(msg,'BUTTON') || ""

  const listButtons = typeof buttons != 'string' ? buttons.map(item => ({body:item})) : [{body:buttons}]

  const button = new Buttons(buttonContent,listButtons,buttonTitle,buttonFooter);

  const number = phoneNumberFormatter(phone);
  console.log("Enviando Botão", new Date())
  
  return button

}

/**
 * Função para criar Lista de whatsapp
 */
const sendList = async (msg) => {

  const listContent = getContentTag(msg,'LISTCONTENT')
  const listAction = getContentTag(msg,'LISTACTION') || "Clique aqui"
  const listHeaderItens = getContentTag(msg,'listHeaderItens') || ""
  const lists = getContentTag(msg,'LIST') || ""
  const listSub = getContentTag(msg,'LISTSUB') || false
  const listTitle = getContentTag(msg,'LISTTITLE') || ""
  const listFooter = getContentTag(msg,'LISTFOOTER') || ""

  const listItens = [{title:listHeaderItens, rows:[]}]

  listItens[0].rows = typeof lists != 'string' ? lists.map((item, index) => ({title:item, description: listSub[index] || ""})) : [{title:lists, description: listSub[0] || ""}]
  const list = new List(listContent,listAction,listItens,listTitle,listFooter);

  console.log("Enviando Lista", new Date())

  return list
}

/**
 * Função para enviar imagem para whatsapp // TODO poderia ser Arquivo mas preciso entender melhor
 */
const sendImage = async (phone, msg) => {

  const imageUrl = getContentTag(msg,'IMAGEURL')
  const imageCaption = getContentTag(msg,'IMAGECAPTION') || ""

  const media = MessageMedia.fromFilePath(imageUrl);
  console.log("Enviando imagem", new Date())

  await client.sendMessage(phone, media, { caption: imageCaption })
};



// Lista de contatos de clientes do dia atual
const listaClientesDoDia = []

let sistemaAtivo = false;

app.get('/paused', async (req, res) => {

  if(req.query.ativar == 's')
    sistemaAtivo = true
  else
    sistemaAtivo = false

  res.send(sistemaAtivo)
})

const adicionaNove = phone => (phone+"")[4] != "9" ? phone.substr(0,4)+"9"+phone.substr(4) : phone;

/* onmessage */
client.on('message', async msg => {
  console.log(msg.type)

  if ((msg.type === 'chat' || msg.type == 'list_response') && msg.body !== null && sistemaAtivo){

    const chat = await msg.getChat()
    const contact = await msg.getContact()
    const name = contact.name || contact.pushname
    const phoneTo = msg.to.split('@')[0]
    const wtppFromComNove = adicionaNove(contact.number)
    const wtppToComNove = adicionaNove(phoneTo)

    // console.log("============== MESSAGE ===================")
    // console.log(msg)
    // console.log("============== CONTACT ===================")
    // console.log(contact)
    // console.log("================ CHAT ====================")
    // console.log(chat)

    const saveMsg = {
        whatsappFrom: wtppFromComNove
        , whatsappTo: wtppToComNove
        , mensagem: msg.body
        , dispositivo: msg.deviceType
      }
    axios.post(`${URL_BARBERBOT}/save-message`, saveMsg, { httpAgent })


    const finalAgendamento = [
      "10 minutos antes"
      ,"20 minutos antes"
      ,"30 minutos antes"
      ,"40 minutos antes"
      ,"1 hora antes"
      ,"Não quero Ser lembrado"
    ]

    if(finalAgendamento.includes(msg.body)){
      msg.body = 'sair'
      client.sendMessage(msg.from, "Ok, Agendamento concluído.")
    }



    // Verifica se o cliente já está na lista de clientes temporária e no banco
    if(!listaClientesDoDia.includes(wtppFromComNove)) {
      
      listaClientesDoDia.push(wtppFromComNove)
  
      const data = {
        nome: name
        ,whatsapp: wtppFromComNove
        ,dispositivo: msg.deviceType
      }

      const verifyClient = await axios.post(`${URL_BARBERBOT}/verify-client`, data, { httpAgent })
      const barber = await axios.get(`${URL_BARBERBOT}/get-barber?barber=${wtppToComNove}`, { httpAgent })
      console.log(wtppToComNove)
      console.log(barber.data)
      if(verifyClient.data != false){
        msg.body = `Bem-vindo de volta ${verifyClient.data}` // Entra no fluxo do dialogFlow Agendamento
      }else{
        msg.body = `Olá Nome ${name} Barbearia ${barber.data}` // Entra no fluxo do dialogFlow e manda uma variável do NOME
      }

    }

    
    console.log(msg.body)
    if(msg.body.includes("sair")){
      console.log("TESTE SAIR", msg.body.includes("sair"))
      listaClientesDoDia.splice(listaClientesDoDia.indexOf(wtppFromComNove),1)
    }

    
    
    //Tempo de espera de enviando mensagem
    chat.sendStateTyping()    
    await sleep(3000)
    chat.clearState()

    const whatsappTo = phoneNumberFormatter(msg.from);
    
    const RespDialogFlow = await sendDialogFlow(msg.body, contact.number)
    const fluxo = RespDialogFlow.fluxo
    const responseDialogFLow = RespDialogFlow.response;

    const fimFluxo = [
      "Agendamento.Cliente - no"
      ,"sair"
    ]

    if(fimFluxo.includes(fluxo)){
      listaClientesDoDia.splice(listaClientesDoDia.indexOf(wtppFromComNove),1)
    }

    console.log("lista Temporária ", listaClientesDoDia)
    
    console.log(`--------------------Nova Mensagem--------------------`);
    console.log(`Mensagem do cliente ${contact.number}: ${msg.body}`);
    console.log(`Resposta do DialogFlow:`);
    console.log(responseDialogFLow);
    
    // const responseDialogFLowOneLine = textOneLine(responseDialogFLow)
    if(responseDialogFLow.includes('<imagemCreate>')){
     await sendImage(whatsappTo, responseDialogFLow)
    }else{
      responseDialogFLow.includes('<text>') ? await client.sendMessage(whatsappTo, await getContentTag(responseDialogFLow,'text')) : ""
      responseDialogFLow.includes('<buttonCreate>') ? await client.sendMessage(whatsappTo, await sendButton(responseDialogFLow))  : ""
      responseDialogFLow.includes('<listCreate>') ? await client.sendMessage(whatsappTo, await sendList(responseDialogFLow))  : ""
      responseDialogFLow.includes('<GET>') ? await client.sendMessage(whatsappTo, await requestGET(responseDialogFLow, wtppFromComNove, wtppToComNove))  : ""
      responseDialogFLow.includes('<POST>') ? await client.sendMessage(whatsappTo, await requestPOST(responseDialogFLow, wtppFromComNove, wtppToComNove))  : ""
      !responseDialogFLow.includes("</") ? await client.sendMessage(whatsappTo, responseDialogFLow) : ""

      const RespMsg = {
         whatsappFrom: wtppFromComNove
         ,mensagem: responseDialogFLow
      }
      axios.post(`${URL_BARBERBOT}/save-response`, RespMsg, { httpAgent })
    }
    
    console.log('-----------------------------------------------------')
  }
});
// ----------------- FIM IMPLEMENTAÇÂO ---------------------

    
server.listen(port, function() {
        console.log('App running on *: ' + port);
});
