var builder = require('botbuilder');
var restify = require('restify');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
//var connector = new builder.ConsoleConnector().listen();
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.choice(session, "Hi " + results.response + ". Who is your favorite Mask and Wig alum?",
        ["Shep Moore-Berg", "Adam Savitt", "Jeff Walton"]); 
    },
    function (session, results) {
        session.userData.favorite = results.response.entity;
        builder.Prompts.choice(session, "Okay, now why is he your favorite? Because you ...", 
        ["liked him in his sophomore year show.", "think he looks great dressed as a princess.", "are married to him."]);
    },
    function (session, results) {
        session.userData.reason = results.response.entity;
        session.send("Got it " + session.userData.name + 
                     "! You think " + session.userData.favorite + " is awesome because you " + session.userData.reason
                     + " That's pretty cool.");
    }
]);