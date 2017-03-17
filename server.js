'use strict'
const express = require('express')
const Slapp = require('slapp')
const BeepBoopConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
const BeepBoopPersist = require('beepboop-persist')
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
	httpGetAsync("https://slack.com/api/users.list?token=" + slapp.verify_token, writeNames);
})

function writeNames(responseText){
	msg.say(responseText);
}


function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


console.log('Listening on :' + config.port)
server.listen(config.port)
