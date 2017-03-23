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

// Slapp context middleware function
// Looks up team info from db and enriches request
module.exports = (db) => {
  return (req, res, next) => {
    let teamId = req.slapp.meta.team_id

    db.getTeam(teamId, (err, team) => {
      if (err) {
        console.error(err)
        return res.send(err)
      }

      req.slapp.meta = Object.assign(req.slapp.meta, {
        app_token: team.access_token,
        bot_token: team.bot.bot_access_token,
        bot_user_id: team.bot.bot_user_id,
        team_name: team.team_name
      })

      next()
    })
  }
}

slapp.message('hi (.*)', ['direct_message','direct_mention','mention'], (msg, text, match1) => {
	msg.say('How are you?').route('handleHi', {what: match1});
})

slapp.route('handleHi', (msg, state) =>{
	msg.say(':smile ' + state.what);
}) 


slapp.message('who', ['direct_message','direct_mention','mention'], (msg, text, match1) => {
	var peopleInSlack = [];



	var token = process.env.SLACK_TOKEN || ''; //see section above on sensitive data

	var options = {
  		host: 'slack.com',
  		path: "/api/users.list?token=" + token  ,
  		//This is what changes the request to a POST request
  		method: 'POST'
	};
	
	var request = https.request(options, function(res) {
 
		 var apiData = '';
 		 res.on('data', function(d) {
			apiData += d;
			
			 
 		 });
		res.on('end', function(){
			var jsonObj = JSON.parse(apiData);
			for(var i=0;i<jsonObj.members.length; i++){
				peopleInSlack.push(jsonObj.members[i].name);
			}
			console.log(peopleInSlack);
			msg.say("These are the people in my neighbourhood: "  + peopleInSlack);
		});

		request.on('error', function(e) {
  			console.error(e);
		});
	}); 

	
 		

	request.end();
	



})


slapp.message('(.*)', ['direct_message'], (msg, text, match) => {

	var message = {
		"text": "I don't know, can you suggest someone?",
    		"attachments": [
       		 {
           		text: '',
         		fallback: 'Yes or No?',
        		callback_id: 'yesno_callback',
         		actions: [
            		{ name: 'answer', text: 'Yes', type: 'button', value: 'yes' },
            		{ name: 'answer', text: 'No',  type: 'button',  value: 'no' }
          ]
       	 }
    	]
}
        msg.say(message);
})

slapp.action('yesno_callback', 'answer', (msg, value) => {
  msg.respond(msg.body.response_url, `${value} is a good choice!`)
})

slapp.route('handleKnows', (msg, state) =>{
	var recommend = sendToRecommendFunction(state.what);
	msg.say(recommend);	
})

function sendToRecommendFunction(matchWord){
	//return "You got it!!";
	if(listOfAllowedNames.indexOf(matchWord.trim()) > -1)
	{
		 return "Huduwai";
	}
	else{
		listOfAllowedNames.push(matchWord.trim());
		return "Sorry! I don't know!";
	}
}

console.log('Listening on :' + config.port)
server.listen(config.port)
