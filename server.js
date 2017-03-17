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
	console.log("Calling..."+ "https://slack.com/api/users.list?token=" + slapp.verify_token);

	var options = {
  		host: 'slack.com',
  		path: "api/users.list?token=" + "xoxp-144960206292-144174800560-156080327717-a9ddfb3338129f81c8a4733d44d0d206",
  		//This is what changes the request to a POST request
  		method: 'POST'
	};
	var req = https.request(options, function(res) {
  		console.log(res.statusCode);
 		 res.on('data', function(d) {
   			 process.stdout.write(d);
 		 });
	});
	//httpGetAsync("https://slack.com/api/users.list?token=" + slapp.verify_token, writeNames);
})

slapp.message('who knows (.*)', ['direct_message','direct_mention','mention'], (msg, text, match1) => {
	msg.say('Let me check').route('handleKnows', {what: match1});
})

slapp.route('handleKnows', (msg, state) =>{
	var listOfNames = "I don't know";
	if(state.what === "java")
	{
		listOfNames = "Deepika";
	}
	
	msg.say(listOfNames);
}) 

console.log('Listening on :' + config.port)
server.listen(config.port)
