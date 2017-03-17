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
	var token = slapp.meta.app_token;
	var options = {
  		host: 'slack.com',
  		path: "/api/users.list?token=" + token  ,
  		//This is what changes the request to a POST request
  		method: 'POST'
	};
	console.log(options);
	var request = https.request(options, function(res) {
  		console.log(res.statusCode);
 		 res.on('data', function(d) {
   			 console.log(process.stdout.write(d));
 		 });
	});

	request.end();
	request.on('error', function(e) {
  	console.error(e);
	});

})


slapp.message('(.*)', ['direct_message'], (msg, text, match) => {
	msg.route('handleKnows', {what: match});
})

slapp.route('handleKnows', (msg, state) =>{
	var listOfAllowedNames = ['java','programming','html','software','development','testing'];
	//msg.say(state2.what);
	if((state.what.trim()) == "software")
	{
		msg.say("Huduwai");
	}
	else if((state.what.trim()) === "software")
	{
		msg.say("Double checking");
	}else{
		msg.say("Sorry");
	}
}) 

function sendRequestForRecommendation(){
	return "Huduwai!!";
}

console.log('Listening on :' + config.port)
server.listen(config.port)
