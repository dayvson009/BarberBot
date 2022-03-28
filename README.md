# BarberBot

O sistema barberbot, é um sistema simples de agendamento, onde tudo é realizado através do whatsapp. O cliente consegue agendar, cancelar de forma fácil e rápida.
O barbeiro por outro lado, consegue tempo e agilidade no seu negócio, podendo também cancelar, desativar, e ver a agenda do dia ou todos agendamentos

## Instalando

Para iniciar precisamos setar o banco de dados, hoje localizado na heroku, postgress. vamos instalar os módulos utilizando o comando `npm install`

## TABELA BARBEARIA

### Intervalo:

No campo Intervalo em minutos de quanto em quanto tempo será mostrado os agendamentos na tela 
Ex: intervalo de 20 min, será mostrado ao usuário o intevalo de acordo com horário de início de expediente.
8:00 as 8:20
8:20 as 8:40

### Franquia:

Caso for franquia, no banco de dados, tabela BARBEARIA, associe o CODBARBEARIA PRINCIPAL AO CAMPO FRANQUIA, pra que seja associado a outra franquia.

## Como a lógica funciona

No sistema, de acordo com a data hora do agendamento, ele vai retornar quais horários estão disponíveis
ou não naquela data específica.

## Fluxo

**Início**

1 - Cliente inicia conversa
2 - É verificado Se o cliente já está salvo no banco ou não
2.1 (Não está no banco de dados)
    Resposta: Olá {{NOME_CLIENTE (variável do whatsapp)}}, Seja bem vindo a {{NOME_BARBEARIA}}

2.2 (Já está no banco de dados)

Fluxo de agendamento:
Escolha qual serviço deseja realizar hoje:
[lista]
-Corte de cabelo
-Barba
-Sobrancelhas
-Corte de cabelo + Barba
-Corte de cabelo + Sobrancelhas
-Barba + Sobrancelhas
-Corte de cabelo + Barba + Sobrancelhas
1- Escolha o mês => Primeiro o barberbot mostra uma lista do mês atual e mês seguinte ou botão
2- Escolha o dia => O barberbot mostra uma lista com os dias do mês atual
3- Escolha seu horário => aqui vai mostrar uma lista só com os horários livres

### UPGRADES:

Opção de cancelar agendamento
Quando finalizar um agendamento perguntar se quer realizar um novo Agendamento
Sempre deixar claro que ele pode SAIR do chatdeagendamento a qualquer momento
Tempo de espera de resposta 3s
Ver como vai ser questão de horários para fim de semana
Quando enviar para o zap do barbeiro mostrar lista de cortes do dia com (cod, nome, horario, preco)
de hoje e abaixo o novo agendamento
O barbeiro também pode optar por:
Ver agenda do dia ou de uma data especifica
Cancelar um agendamento, ele informa só o ID e a confirmação
pode escolher a opção de Fechado ( não vai receber agendamentos nesse período)