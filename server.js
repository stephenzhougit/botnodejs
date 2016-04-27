var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var botConnectorOptions = { 
    appId: process.env.BOTFRAMEWORK_APPID, 
    appSecret: process.env.BOTFRAMEWORK_APPSECRET 
};
var Client = require('node-rest-client').Client;
 
var client = new Client();
 

var moment = require('moment');


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
        var date = moment(data[0].starttime);
        session.send('The last call is at %s', date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    } else if(session.message.text.indexOf('duration') >= 0) {
        session.send('The last call lasts %s seconds', data[0].callduration);
    } else if(session.message.text.indexOf('transcript') >= 0) {
        session.send('The transcript of the last calls is  %s', data[0].speechtotextandentitydata.text);
    } else if(session.message.text.indexOf('what') >= 0) {
        session.send('The keywords of the last call are: %s ', data[0].speechtotextandentitydata.entities.keyword);
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
