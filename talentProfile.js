//Customer Specific Halogen API Configurations
var HalogenAPIUsername="TP";
var HalogenAPIPassword="Admin1234";
var customerHalogenPath="/halogen_ts2";
// libraries used for REST calls
var https = require('https');

getHalogenTPStructure();

//HTTP Get Call execution
function httpGetExecute(options){
request = https.get(options, function(res){
   var body = "";
   res.on('data', function(data) {
      body += data;
   });
   res.on('end', function() {
    //full HTML response or json object
      console.log(body);
   })
   res.on('error', function(e) {
      console.log("Got error in HTTP Get Call: " + e.message);
   });
    });
}

function initializeHttpRequestHeaders(TPServicename){
// REST configurations options for methods with BASIC Authentication
    var TPOptions = {
           host: 'trial.na1.hgncloud.com',
           //port: 443,// we are not using any specific port for now.
           path: customerHalogenPath+'/restws/tp/v1_0/'+TPServicename,
           // Basic Authentication Headers
           headers: {
              'Authorization': 'Basic ' + new Buffer(HalogenAPIUsername + ':' + HalogenAPIPassword).toString('base64')
           }
    };
    return TPOptions;
}
function getHalogenTPStructure(){
    var TPStructureServicename="structure";
    httpGetExecute(initializeHttpRequestHeaders(TPStructureServicename));
}
