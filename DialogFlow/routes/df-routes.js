const chatbot = require('../chatbot/chatbot')
module.exports = app => {

    app.post('/text_query', async (req, res)=>{
        
        const {text, userId} = req.body
        console.log(`--------------------Nova Mensagem--------------------`);
        console.log(`Mesagem Enviada pelo usuário ${userId}: ${text}`)

        let response;
        let fluxo;
        
        try{

            const resultQuery = await chatbot.textQuery(text, userId)
            response = resultQuery.fulfillmentText
            fluxo = resultQuery.intent.displayName

            console.log(`Resposta do Dialogflow: ${resultQuery.fulfillmentText}`)
            console.log(`Fluxo: ${resultQuery.intent.displayName}`)

        }catch(err){
            response = `Desculpe não conseguir entender, tente usar uma outra palavra`
            console.log(response)
            console.log(err)
        }
        
        res.send({"response":response, "fluxo": fluxo})
    });
    
    // app.post('/event_query', (req, res)=>{
    //     console.log(req)
    //     res.send('text query')
    // });
}