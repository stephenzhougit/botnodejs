var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'echobotnodejs', appSecret: '2a6d9ba194e14335abb3dbe8765a8a56' });
// bot.add('/', function (session) {
//     session.send('Hello World');
// });


// bot.add('/', function (session) {
//     if (!session.userData.name) {
//         session.beginDialog('/profile');
//     } else {
//         session.send('Hello %s!', session.userData.name);
//     }
// });
// bot.add('/profile', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         session.endDialog();
//     }
// ]);
var Client = require('node-rest-client').Client;
 
var client = new Client();
 
// direct way 

bot.add('/', new builder.CommandDialog()
    .matches('^set name', builder.DialogAction.beginDialog('/profile'))
    .matches('^quit', builder.DialogAction.endDialog())
    .onDefault(function (session) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            
            client.get("http://13.82.56.114/getLastCall", function (data, response) {
	// parsed response body as js object 
	            // console.log(session);
	// raw response 
	// console.log(response);
                // var jsonObj = JSON.parse(data);
                // session.send("callfrom");
                session.send('Call from %s!', data[0].callfrom);
            });
        }
    }));
bot.add('/profile',  [
    function (session) {
        if (session.userData.name) {
            builder.Prompts.text(session, 'What would you like to change it to?');
        } else {
            builder.Prompts.text(session, 'Hi! What is your name?');
        }
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 8011, function () {
    console.log('%s listening to %s', server.name, server.url); 
});