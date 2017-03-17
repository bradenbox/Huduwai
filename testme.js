
'use strict'
const https = require('https');

function testme(){

	var listOfNames = "no one";
	console.log("Calling..."+ "https://slack.com/api/users.list?token=" + "xoxp-144960206292-144174800560-156008783394-c6ed641d92e1da8a49455a38a7328271");

	var options = {
  		host: 'slack.com',
  		path: "/api/users.list?token=" + "xoxp-144960206292-144174800560-156008783394-c6ed641d92e1da8a49455a38a7328271",
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
}


testme();