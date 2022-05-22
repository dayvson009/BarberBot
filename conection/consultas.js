const db = require('./conectdb.js')

db.connect()


// Verifica se o cliente já existe
const verifyClientExist = async (wpp) => {
  let consulta;
  
  const query = `select c.codcliente, c.nome from cliente c where whatsapp = '${wpp}'`;

  try {

    consulta = await db.query(query)
    
  } catch(err){

    console.log(err)

  } finally{
    return consulta.rows.length > 0 ? true : false
  }
}

//Adiciona um Novo Cliente
const saveNewClient = async ({nome, whatsapp, dispositivo}) => {
  let insert

  const sql = `INSERT INTO cliente (nome, whatsapp,qtdcortes, dispositivo, ativo)
  VALUES ('${nome}','${whatsapp}',0,'${dispositivo}','A')`;

  try{
    insert = await db.query(sql)
    console.log(insert.rowCount > 0 ? "Novo cliente inserido" : "Não foi possível inserir cliente")

  }catch(err){
    console.log(err)
    console.log("ERRO: ao inserir cliente")
  }finally{
  }
}

//Pegar dados do cliente pelo whatsapp
const getClient = async wpp => {
  let consulta;
  
  const query = `select * from cliente c where whatsapp = '${wpp}'`;
  
  try {

    consulta = await db.query(query)
    
  } catch(err){

    console.log(err)

  } finally{
    return consulta.rows
  }
}

//Atualiza o nome do Cliente
const updateClient = async (wpp, newName) => {
  let update
  const sql = `UPDATE cliente set nome='${newName}' WHERE whatsapp='${wpp}'`;

  try{
    update = await db.query(sql)
    console.log(update.rowCount > 0 ? "Nome Atualizado" : "Não foi possível atualizar Nome")

  }catch(err){
    console.log("ERRO: Não foi possível atualizar o Nome do Cliente")
  }finally{
  }
}

//Salva uma nova Mensagem
const saveMessageChat = async ({whatsappFrom, whatsappTo, mensagem, dispositivo}) => {
  let insert

  const sql = `INSERT INTO conversa (whatsappfrom,whatsappto,mensagem,dispositivo,datahoramsg)
  VALUES ('${whatsappFrom}','${whatsappTo}','${mensagem}','${dispositivo}',NOW())`;

  try{
    insert = await db.query(sql)
    console.log(insert.rowCount > 0 ? "Nova Mensagem inserida" : "Não foi possível inserir mensagem")

  }catch(err){
    console.log(err)
    console.log("ERRO: ao inserir mensagem")
  }finally{
  }
}

//Resposta do sistema da conversa recente
const saveResponseMessage = async ({mensagem, whatsappFrom}) => {
  let update

  const sql = `UPDATE conversa set resposta='${mensagem}', datahoraresposta=NOW() WHERE codconversa=(select max(codconversa) from conversa c where whatsappfrom = '${whatsappFrom}')`;

  try{
    update = await db.query(sql)
    console.log(update.rowCount > 0 ? "Resposta Atualizada" : "Não foi possível atualizar Resposta")

  }catch(err){
    console.log(err)
    console.log("ERRO: ao salvar resposta")
  }finally{
  }
}
/*
//Pegar dados do cliente pelo whatsapp
const getDateAvailable = async ({whatsappTo}) => {
  let consulta;
  
  const queryAgendamento = `select * from agendamento a 
inner join barbearias b on b.codbarbearia = a.codbarbearia 
where b.whatsapp = '${whatsappTo}'`;

  const queryFuncionamento = `select f.dia, b.intervaloagendamento, f.horaentrada, f.horaintervalosaida, f.horaintervalovolta, f.horasaida from funcionamento f 
inner join barbearias b on b.codbarbearia = f.codbarbearia 
where b.whatsapp = '${whatsappTo}'`;
  
  try {

    consultaAgendamento = await db.query(queryAgendamento)
    console.log(consultaAgendamento)
    // Object.assign(consulta, consultaAgendamento.rows)
    // console.log("------------------")
    // console.log(consulta)
    // consultaFuncionamento = await db.query(queryFuncionamento)
    // Object.assign(consulta, consultaFuncionamento.rows)
    
  } catch(err){

    console.log(err)

  } finally{
    return consulta
  }
}*/
const getDateAvailable = async whatsappTo => {
  let consulta;
  
  const query = `select a.datamarcada, count(a.codagendamento) from agendamento a 
inner join barbearias b on b.codbarbearia = a.codbarbearia 
where b.whatsapp = '${whatsappTo}' and a.datamarcada > to_char(now(), 'YYYY/MM/DD')
group by  a.datamarcada`;
  
  try {

    consulta = await db.query(query)
    
  } catch(err){

    console.log(err)

  } finally{
    return consulta.rows
  }
}

const getFuncionamento = async whatsappTo => {
  let consulta;
  
  const query = `select f.dia, b.intervaloagendamento, f.horaentrada, f.horaintervalosaida, f.horaintervalovolta, f.horasaida from funcionamento f 
inner join barbearias b on b.codbarbearia = f.codbarbearia 
where b.whatsapp = '${whatsappTo}'`;
  
  try {

    consulta = await db.query(query)
    
  } catch(err){

    console.log(err)

  } finally{
    return consulta.rows
  }
}

const getDayAvailable = async ({whatsappTo, data}) => {
  let consulta;
  
  const query = `select a.horamarcada from agendamento a 
inner join barbearias b on b.codbarbearia = a.codbarbearia 
where b.whatsapp = '${whatsappTo}' and a.datamarcada = '${data}'`;
  
  try {

    consulta = await db.query(query)
    
  } catch(err){

    console.log(err)

  } finally{
    return consulta.rows
  }
}


/*
const deleteValues = async (id) => {
  const sqlValues = `DELETE FROM public.valores WHERE idvalor = ${id}`;

  try {
    const deleteValores = await db.query(sqlValues)
  } finally {
  }
}
*/


module.exports = {
  verifyClientExist
  ,saveNewClient
  ,getClient
  ,updateClient
  ,saveMessageChat
  ,saveResponseMessage
  ,getDateAvailable
  ,getFuncionamento
  ,getDayAvailable
}