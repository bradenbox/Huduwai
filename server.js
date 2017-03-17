'use strict'
const express = require('express')
const Slapp = require('slapp')
const BeepBoopConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
const BeepBoopPersist = require('beepboop-persist')
const https = require('https');

const Chronos = require('./src/chronos')
const config = require('./src/config').validate()

var slapp = Slapp({
  verify_token: config.slack_verify_token,
  log: config.slapp_log,
  colors: config.slapp_colors,
  record: 'out.jsonl',
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
})

var server = slapp.attachToExpress(express())

slapp.message('hi (.*)', ['direct_message','direct_mention','mention'], (msg, text, match1) => {
	msg.say('How are you?').route('handleHi', {what: match1});
})

slapp.route('handleHi', (msg, state) =>{
	msg.say(':smile ' + state.what);
}) 


slapp.message('who', ['direct_message','direct_mention','mention'], (msg, text, match1) => {
	var listOfNames = "no one";
	var options = {
  		host: 'slack.com',
  		path: "/api/users.list",
  		//This is what changes the request to a POST request
  		method: 'POST'
	};
	console.log(options);
	var req = https.request(options, function(res) {
  		console.log(res.statusCode);
 		 res.on('data', function(d) {
   			 process.stdout.write(d);
 		 });
	});

	req.end();
	req.on('error', function(e) {
  	console.error(e);
	});

})


slapp.message('(.*)', ['direct_mention'], (msg, text, match2) => {
	msg.say(match2).route('handleKnows', {what: match2});
})

slapp.route('handleKnows', (msg, state2) =>{
	var listOfAllowedNames = ['java','programming','html','software','development','testing'];
	//msg.say(state2.what);
	if(listOfAllowedNames.indexOf(state2.what.trim()) > -1)
	{
		msg.say(sendRequestForRecommendation());
	}
	else
	{
		msg.say("Sorry!");
	}
}) 

function sendRequestForRecommendation(){
	return "Huduwai!!";
}

console.log('Listening on :' + config.port)
server.listen(config.port)
