# BarberBot 0.22.0

O sistema barberbot, é um sistema simples de agendamento, onde tudo é realizado através do whatsapp. O cliente consegue agendar, cancelar de forma fácil e rápida.
O barbeiro por outro lado, consegue tempo e agilidade no seu negócio, podendo também cancelar, desativar, e ver a agenda do dia ou todos agendamentos

```text
Na versão Atual, cada barbeiro é uma barbearia, porém na próxima versão deverá ser escolhido a opção de qual barbeiro escolher e de qual barbearia ele trabalha atualmente.
```

O projeto encontra-se na Heroku `barberbot01@gmail.com`.

## Instalando

Para iniciar o projeto primeiramente precisamos fazer um git clone neste repositório.
Agora vamos instalar utilizando o comando `npm install`
as configurações do banco estão no arquivo .env (no drive)

## Banco de dados

![Capturar](https://user-images.githubusercontent.com/8366179/174475924-46e703d1-a029-4992-b399-e3dcf89c392d.JPG)

## TABELA BARBEARIA - (explicando alguns campos)

**intervaloagendamento** : é o intervalo em minutos de um agendamento para o outro. Ex: intervalo de 20 min
* 8:00 as 8:20
* 8:20 as 8:40
* ...

**botpause** : se o barbeiro acionar o comando *botpause*, o chatbot fica desativado até que ele dê o comando *botstart*

## Como a lógica funciona

No sistema, de acordo com a data hora do agendamento, ele vai retornar quais horários estão disponíveis
ou não naquela data específica.

## Fluxo

**Início**

    1.0 - Cliente inicia conversa

    2 - [Endpoint - Verifica se é Cliente] Se o whatsapp do cliente já está salvo no banco ou não

    2.1 - (Não está no banco de dados)
    
    2.1.1 - Olá {NOME_CLIENTE}, Seja bem vindo a {NOME_BARBEARIA}, posso lhe chamar de {NOME_CLIENTE}?
   
   ![msg 1 - 1º Acesso](https://user-images.githubusercontent.com/8366179/168482224-408f3f98-9fea-44b8-b9d3-d58f1f21945d.JPG)
    
    2.1.2 - SIM - Segue pra etapa (3)
    
    2.1.3 - NÃO
        
    2.1.3.1 - Então como devo lhe chamar?
        
    2.1.3.2 - Cliente: FULANO
        
    2.1.3.3 - OK {NOVO_NOME_CLIENTE}, salvei seu novo nome, podemos continuar?
        
    2.1.3.4 - NÃO -> Volta pra etapa (2.1.3)
        
    2.1.3.5 - SIM -> Segue pra etapa (3)

    2.2 - (Já está no banco de dados)
    
    2.2.1 - Oi $nome, que bom ver você novamente. 💈 Lembrando que a qualquer momento você pode digitar *SAIR* para encerrar! Vamos fazer um novo agendamento?
    
    ![msg 1 - Já possui cadastro](https://user-images.githubusercontent.com/8366179/168482225-60093526-48d0-4d49-ae61-a1a071860ccc.JPG)
    
2.2.2 - Segue pra etapa (3)

3 - [Endpoint - pegar Serviços] -> {NOME_CLIENTE} Vamos lá, Qual serviço será feito hoje?

3.1 - Mostra Lista de Serviços para escolher
    * Cabelo
    * Barba
    * Bigode
    * Cabelo + Barba
    * Cabelo + Bigode
    * Barba + Bigode
    * Cabelo + Bigode + Barba

4 - [Endpoint - pegar Datas Disponíveis] -> {NOME_CLIENTE} Vamos lá, qual melhor dia para o agendamento, Confira na lista abaixo os dias disponíveis

![msg 2](https://user-images.githubusercontent.com/8366179/168482226-5f1a985d-e126-480c-a1c9-502eb69b99d0.JPG)

4.1 - Mostra lista de datas disponíveis de acordo com o dia de funcionamento da barbearia e os dias que estão disponíveis
    * 19/06/2022
    * 20/06/2022
    * 25/06/2022
    * 26/06/22

4.2 - Ok, data $data agendada, está correto ou quer mudar?

    4.2.1 - *mudar* volta para etapa (4)

    4.2.2 - *correto* segue pra etapa (5)

5 - [Endpoint - pegar Horas Disponíveis] -> No dia {DATA_ESCOLHIDA}, qual melhor horáirio?\n Confira a lista dos horários disponíveis abaixo

![msg 3](https://user-images.githubusercontent.com/8366179/168482227-e51b4f24-1ebb-41f0-a95c-eaf463a2ba75.JPG)

5.1 - Mostra lista de horários disponíveis no sistema, referente a data escolhida
    * 08:00
    * 08:40
    * 09:20
    * 14:20
    * 15:00

6 - Confirma que seu agendamento está concluído, e pergunta se vc quer ser lembrado

![msg 4](https://user-images.githubusercontent.com/8366179/168482228-ced00617-523d-48fa-97a2-0d477ddf977e.JPG)

6.1 - OK, dia {DATA_ESCOLHIDA} às {HORA_ESCOLHIDA} será seu agendamento, vamos definir um lembrete, pra que você não esqueça?    

![msg 5](https://user-images.githubusercontent.com/8366179/168482229-0da12d0d-b933-4007-8c47-e9fd60591a42.JPG)

6.2 - Aqui mostra uma lista para lembrete com opções de ser lembrando:
    * 10 minutos antes
    * 20 minutos antes
    * 30 minutos antes
    * 40 minutos antes
    * 1 hora antes
    * Não quero Ser lembrado

7 - Ao escolher a hora ou não recebe uma mensagem de finalizado e uma de sair

![msg 6 -Final](https://user-images.githubusercontent.com/8366179/168482231-9a7885e8-c2fe-4cd2-854b-2d14e4b556a2.JPG)
![msg Sair](https://user-images.githubusercontent.com/8366179/168482232-ae67188f-1c28-4a75-a120-b922b3269b8f.JPG)

**Barbeiro Recebe**

![Whatsapp do cabelereiro](https://user-images.githubusercontent.com/8366179/168482233-d292718e-5c05-4dc3-b16f-9d3c5e023798.JPG)

---

### Versão 1.0.0 pendencias para lançamento.

**Cliente**

- [x] Criar endpoint para pegar os serviços da barbearia
- [x] Escolher o serviço
- [x] Criar endpoint para salvar tudo de uma vez
- [ ] Adicionar mais botões ou listas no dialogflow (evitando erros desnecessários)
- [x] Quando finalizar um agendamento perguntar se quer realizar um novo Agendamento
- [x] Sempre deixar claro que ele pode SAIR do chatdeagendamento a qualquer momento
- [x] Ver como vai ser questão de horários para fim de semana

**Barbearia**

- [ ] Endpoint com opção de Pausar e continuar
- [ ] Endpoint para cancelar agendamento
- [ ] Endpoint para atualizar agendamentos
- [ ] O barbeiro também pode optar por ver agenda do dia ou de uma data especifica
- [x] Adicionar ao banco de dados tabela `Barbeiro` um [ATIVO] = S ou N
- [x] Adicionar ao banco de dados tabela `Agendamento` uma chave secundária [CODSERVICO]
- [x] Adicionar ao banco de dados tabela `Barbearias` um campo linkgooglemaps

**Geral**

- [x] Tempo de espera de resposta 3s
- [ ] Atualizar o código do whatsapp para escanear o QR-CODE por um front-end
- [ ] Subir para Heroku o back-end e testar
- [ ] Mudar a URL dos GET e POSTS na Heroku
- [ ] Subir para Heroku o DialogFlow e testar
- [ ] Subir para Heroku o Whatsapp testar
- [ ] Testar com 10 pessoas diferentes realizando um agendamento
- [ ] Se tudo ocorreu como esperado! Lançar a Versão 1.0.0
- [ ] Lançar Versão e comercializar
- [x] Melhorar o Fluxo do DialogFlow
- [ ] Atualizar o fluxo com listas e botões (se puder usar botões)
- [ ] Adicionar Emojis no fluxo

**Vendas**

- [ ] A venda será comissionada e vitalícia, O vendedor ganha por venda, 50% comissão e nos meses seguintes 25% de cada barbearia Ativa
- [ ] Preciso definir valores, pensei em 50,00 sem acessoria e 100,00 com acessoria: relatórios mensais ou semanais e ideias inovadoras
- [ ] Iniciar com 2 vendedores 

**Marketing**

- [ ] Divugar no youtube
- [ ] Panfletos
- [ ] Boca a boca (indique e ganhe)

## Versão 2.0.0

* O agendamento é realizado por funcionário (abrindo o leque para que o back-end seja realizado não só para barbearias mas sim para outros negócios)
* A venda poderá ser feita através da internet, e toda configuração através de um crm simples e online, fazendo com que as vendas locais torne-se nacionais

### Response whatsappweb api

![responseWhatsapp](https://user-images.githubusercontent.com/8366179/172029899-fd0a8bd4-ad22-43ce-b3a8-4530d761cb30.png)
