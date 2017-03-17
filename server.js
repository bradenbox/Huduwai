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
	var listOfNames = "no one";



	var token = process.env.SLACK_TOKEN || ''; //see section above on sensitive data

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


	



})


slapp.message('(.*)', ['direct_message'], (msg, text, match) => {

	msg.say('Do you want to know expert for '+ match +' ?').route('handleKnows', {what: match});
})

slapp.route('handleKnows', (msg, state) =>{
	var recommend = sendToRecommendFunction(state.what);
	msg.say(recommend);	
	msg.say({
    text: '',
    attachments: [
      {
        text: 'Was the recommendation helpful?',
        fallback: 'Are you sure?',
        callback_id: 'doit_confirm_callback',
        actions: [
          { name: 'answer', text: 'Yes', type: 'button', value: 'yes' },
          { name: 'answer', text: 'No', type: 'button', value: 'no' }
        ]
      }]
    })
  // handle the response with this route passing state
  // and expiring the conversation after 60 seconds
  .route('handleDoitConfirmation', state, 60)
})

function sendToRecommendFunction(matchWord){
	return "Deepika";
}

slapp.route('handleDoitConfirmation', (msg, state) => {
  // if they respond with anything other than a button selection,
  // get them back on track
  if (msg.type !== 'action') {
    msg
      .say('Please choose a Yes or No button :wink:')
      // notice we have to declare the next route to handle the response
      // every time. Pass along the state and expire the conversation
      // 60 seconds from now.
      .route('handleDoitConfirmation', state, 60)
    return
  }

  let answer = msg.body.actions[0].value
  if (answer === 'yes') {
    msg.respond(msg.body.response_url, {
      text: `Thanks!`,
      delete_original: true
    })
    return
  }

  if (answer === 'no') {
    msg.respond(msg.body.response_url, {
      text: `Sorry! Better luck next time`,
      delete_original: true
    })
    return
  }
  
})

console.log('Listening on :' + config.port)
server.listen(config.port)
