var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var botConnectorOptions = { 
    appId: process.env.BOTFRAMEWORK_APPID, 
    appSecret: process.env.BOTFRAMEWORK_APPSECRET 
};
var Client = require('node-rest-client').Client;
 
var client = new Client();
 
// direct way 


// Create bot
var bot = new builder.BotConnectorBot({ appId: 'echobotnodejs', appSecret: '2a6d9ba194e14335abb3dbe8765a8a56' });
bot.add('/', function (session) {
    
    //respond with user's message
    
    client.get("http://13.82.56.114/getLastCall", function (data, response) {
	// parsed response body as js object 
	// console.log(data);
    // session.send("You said " + session.message.text);
    if(session.message.text.indexOf('who') >= 0) {
        session.send('The last call is from %s', data[0].callfrom);
    } else if(session.message.text.indexOf('when') >= 0) {
        session.send('The last call is at %s', data[0].starttime);
    } else if(session.message.text.indexOf('duration') >= 0) {
        session.send('The last call lasts %s seconds', data[0].callduration);
    } else if(session.message.text.indexOf('transcript') >= 0) {
        session.send('The last call lasts %s seconds', data[0].speechtotextandentitydata.text);
    }
    
	// raw response 
	// console.log(response);
    });
});

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(process.env.port || 8011, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
