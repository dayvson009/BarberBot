const updateStatusMessages = () => {
  console.log('cuidado ao olhar pra cima')
}

/**
 * Aplicação dispara o Lembrete, deve rodar a cada 1 minuto
 */
const verifyTimeScheduling = () => {
  console.log("Se houver lembretes agendados envia um chatbot paa o cliente")
}

const retira_acentos = (str) => {

    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr="";
    for(i=0; i<str.length; i++) {
        troca=false;
        for (a=0; a<com_acento.length; a++) {
            if (str.substr(i,1)==com_acento.substr(a,1)) {
                novastr+=sem_acento.substr(a,1);
                troca=true;
                break;
            }
        }
        if (troca==false) {
            novastr+=str.substr(i,1);
        }
    }
    return novastr;
}

function servicosporintervalo(a,b,i){
    totalporperiodo = 0
    w = true;
    while(w){
    ha = parseInt(a.split(':')[0])
    ma = parseInt(a.split(':')[1])
    hb = parseInt(b.split(':')[0])
    mb = b.split(':')[1]
    
    
    min = ma+i;
    (min >= 60) && ha++ && (min = min - 60);
    
    w = parseInt(ha+''+min)<parseInt((hb+''+mb))
    if(w)
        totalporperiodo++
    
    a=ha+':'+min
    b=hb+':'+mb
    
    }

    return totalporperiodo
}

const datasParaAgendamento = (allAgendamentos, jornadaTrabalho) => {

  horariofuncionamento = {}

  jornadaTrabalho.forEach(item => {
    if(item.horaintervalosaida == null){
      total = servicosporintervalo(item.horaentrada, item.horasaida, item.intervaloagendamento)
      diaSemana = retira_acentos(Object.values(item.dia).join(''))
    }else{

      expediente1 = servicosporintervalo(item.horaentrada, item.horaintervalosaida, item.intervaloagendamento)
      expediente2 = servicosporintervalo(item.horaintervalovolta, item.horasaida, item.intervaloagendamento)
      total = expediente1 + expediente2
      diaSemana = retira_acentos(Object.values(item.dia).join(''))
    }
      
      horariofuncionamento[diaSemana] = total
  })

  diassemana = {0:'domingo',1:'segunda',2:'terca',3:'quarta',4:'quinta',5:'sexta',6:'sabado'}
  datasLivres = []

  for(i=0;i<30;i++){
    dataMes = new Date(new Date().setDate(new Date().getDate()+i))
    dia = dataMes.getDay()
    data = dataMes.toLocaleString('pt-BR',{dateStyle:'short'})

    var index = allAgendamentos.map(function(e) { return e.datamarcada; }).indexOf(data);
    const totalAgendados = (index >= 0) ? allAgendamentos[index].count : 0;
    const vagas = horariofuncionamento[diassemana[dia]]-totalAgendados

    if(horariofuncionamento[diassemana[dia]] && vagas > 0){
      datasLivres.push({"data":data, dia: diassemana[dia], "vagas": vagas})
    }
  }

  return datasLivres;
}

function horariosIntervalos(a,b,i){
    let horasFuncionamento = []
    totalporperiodo = 0
    w = true;
    while(w){
    ha = parseInt(a.split(':')[0])
    ma = parseInt(a.split(':')[1])
    hb = parseInt(b.split(':')[0])
    mb = b.split(':')[1]
    
    min = ma+i;
    (min >= 60) && ha++ && (min = min - 60);

     w = parseInt(ha+''+min)<parseInt((hb+''+mb))
    if(w){
      let zeroFrenteH = a.split(':')[0]
      let zeroAtrasM = a.split(':')[1]

      if(zeroFrenteH.length == 1)
        zeroFrenteH = '0'+zeroFrenteH
      if(zeroAtrasM.length == 1)
        zeroAtrasM = zeroAtrasM+'0'

      a = zeroFrenteH+':'+zeroAtrasM
      horasFuncionamento.push(a)
    }
    
      a=ha+':'+min
      b=hb+':'+mb
    
    }
    return horasFuncionamento

}

const horasDisponiveisDoDia = (item, horasOcupadas) => {

  if(item.horaintervalosaida == null){
    expediente1 = horariosIntervalos(item.horaentrada, item.horasaida, item.intervaloagendamento)
    expediente1
  }else{
    expediente1 = horariosIntervalos(item.horaentrada, item.horaintervalosaida, item.intervaloagendamento)
    expediente2 = horariosIntervalos(item.horaintervalovolta, item.horasaida, item.intervaloagendamento)
    horariosDisponiveis = expediente1.concat(expediente2)
  }

  horasOcupadas.forEach(item => {
    horariosDisponiveis.splice(horariosDisponiveis.indexOf(item.horamarcada), 1)
  })

  return horariosDisponiveis

}

module.exports = {
  updateStatusMessages
  ,verifyTimeScheduling
  ,datasParaAgendamento
  ,horasDisponiveisDoDia
}