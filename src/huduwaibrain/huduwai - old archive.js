

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['(.*)=(.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
	console.log(message.match[1]);
	console.log(message.match[2]);
	console.log("Running:"  + 'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + message.match[2] + ' ' + message.match[1]);
	
	var javachild = require('child_process').exec(
	  'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + message.match[2] + ' ' + message.match[1],
	  function(error, stdout, stderr){
		  console.log('stdout: ' + stdout);
	      console.log('stderr: ' + stderr);
	      if (error !== null) {
	         console.log('exec error: ' + error);
	      }
	      
	      bot.reply(message, message.match[2] + " knows about " + message.match[1] +", eh? Noted!");
	  });

});

controller.hears(['(.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
	
	console.log("Running:" + 'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver ask ' + message.match[1]);
			var originalQuestion = message.match[1];
			var javachild = require('child_process').exec(
			  'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver ask ' + originalQuestion,
			  function(error, stdout, stderr){
				  console.log('stdout: ' + stdout);
			      console.log('stderr: ' + stderr);
			      if (error !== null) {
			         console.log('exec error: ' + error);
			      }
			      
			      bot.startConversation(message, function(err, convo) {
		                if (!err) {
		                	var answer = "" + stdout;
		                	if (answer === ("I don't know")){
		                		convo.ask("I'm afraid I don't know! Can you suggest someone?", [
		                		    {
		                	        	pattern: "yes",
		                		    	default: true,
		                	        	callback: function(response, convo) {
		                	        		console.log("Running:"  + 'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + response.text + ' ' + originalQuestion);
			                				
	                						var javachild = require('child_process').exec(
		                					  'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + response.text + ' ' + originalQuestion,
		                					  function(error, stdout, stderr){
		                						  console.log('stdout: ' + stdout);
		                					      console.log('stderr: ' + stderr);
		                					      if (error !== null) {
		                					         console.log('exec error: ' + error);
		                					      }
		                					      
		                					      bot.reply(message, "Thank you! I'll try " + response.text + " next time.");
		                					      convo.stop();
		                					  });
		                			

		                	            }
		                	        },
		                	        {
			                	        	pattern: "no",
			                	        	callback: function(response, convo) {
			                	        		bot.reply(message, "Okay. I'll try to get better. Have a nice day!");
		                						convo.stop();
			                	           } 
		                	            }

		                	        ]);
				                		
		                		bot.say({
			                		    text: "Does anyone know an expert on " + originalQuestion + "? Type '@huduwai " + originalQuestion + "={Name}'  to give a suggestion!",
			                		    channel: "#help_huduwai"
			                		});
			                	}
			                	else {
			                		convo.ask("I suggest " + answer + ". " + "Was he\\she able to help you?", 
			                				function(response, convo3) {
			                			if (response.text.toUpperCase() === ("YES")){
	                						console.log("Running:"  + 'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + answer + ' ' + originalQuestion);
		                				
	                						var javachild = require('child_process').exec(
		                					  'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + answer + ' ' + originalQuestion,
		                					  function(error, stdout, stderr){
		                						  console.log('stdout: ' + stdout);
		                					      console.log('stderr: ' + stderr);
		                					      if (error !== null) {
		                					         console.log('exec error: ' + error);
		                					      }
		                					      
		                					      bot.reply(message, "Great! Until next time.");
		                					      convo3.stop();
		                					      convo.stop();
		                					  });
		                			

	                					} else {
	                						convo.next();
	                						convo.ask("Okay...Can you suggest someone?", 
	        		                				function(response, convo4) {
				                							if (response.text.toUpperCase() !== ("NO")){
						                						console.log("Running:"  + 'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + response.text + ' ' + originalQuestion);
							                				
						                						var javachild = require('child_process').exec(
							                					  'java -cp "edu.mit.jwi_2.4.0.jar;snowball-stemmer-1.3.0.581.1.jar;Huduwai.jar" HuduwaiReceiver suggest ' + response.text + ' ' + originalQuestion,
							                					  function(error, stdout, stderr){
							                						  console.log('stdout: ' + stdout);
							                					      console.log('stderr: ' + stderr);
							                					      if (error !== null) {
							                					         console.log('exec error: ' + error);
							                					      }
							                					      
							                					      bot.reply(message, "Thank you! I'll try " + response.text + " next time. Cheers!");
							                					      convo4.stop();
							                					      convo.stop();
							                					  });
							                			
			
						                					} else {
						                						bot.reply(message, "Okay. I'll try to get better. Have a nice day!");
						                						convo4.stop();
						                						convo.stop();
						                					}
	        			                			});
	                						bot.say({
	    			                		    text: "Does anyone know an expert on " + originalQuestion + "? Type @huduwai '" + originalQuestion + "={Name}'  to give a suggestion!",
	    			                		    channel: "#help_huduwai"
	    			                		});

	                					}
			                			});
			                		}
			                	}
			      });
			  }
			);
	
	
	
});



