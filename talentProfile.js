//Customer Specific Halogen API Configurations
var HalogenAPIUsername="TP";
var HalogenAPIPassword="Admin1234";
var customerHalogenPath="/halogen_ts2";
var TPStructureVersion = "1262"; // toDo: change to dynamic
// libraries used for REST calls
var https = require('https');
var DOMParser = new (require('xmldom')).DOMParser;

//getHalogenTPStructure();

var username="gadams";
getHalogenSkillsforUser(username,TPStructureVersion);



//HTTP Get Call execution
function httpGetExecute(options, callback){
request = https.get(options, function(res){
   var body = "";
   res.on('data', function(data) {
      body += data;
   });
   res.on('end', function() {
    //full HTML response or json object
      //console.log(body);
      callback(body);
   })
   res.on('error', function(e) {
      console.log("Got error in HTTP Get Call: " + e.message);
   });
    });
}

function getHalogenTPStructure(callbacktoSectionID){
    var TPStructureServicename="structure";
    var res = httpGetExecute(initializeHttpRequestHeaders(TPStructureServicename),function(body){
        //console.log(body);
        callbacktoSectionID(body);

    });
    //console.log(res);
    
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

function getHalogenSkillsforUser(username,TPStructureVersion){ getSkillsSectionID(function(sectionID){
        //console.log(sectionID);
        var TPGetSkillsServicename='users/'+username+'/talentprofile/records/'+sectionID+'?versionid='+TPStructureVersion;
        var res = httpGetExecute(initializeHttpRequestHeaders(TPGetSkillsServicename),function(body){
        console.log(body);
        

    });



    });
}
function getSkillsSectionID(callbacktoGetSkills){
    getHalogenTPStructure(function(body){
        //console.log(body);
        var document = DOMParser.parseFromString(body);
        var TPsectionsByName = document.getElementsByTagName('sectionType');
        //console.log(TPsectionsByName[10].firstChild.nodeValue);

        for (var i = TPsectionsByName.length - 1; i >= 0; i--) {
            thisSectionNameObject= TPsectionsByName[i];
            if (thisSectionNameObject.firstChild.nodeValue=="SKILL") {
                    var sectionID = thisSectionNameObject.parentNode.getElementsByTagName('id')[2].firstChild.nodeValue;
                    //console.log(sectionID);
                    callbacktoGetSkills(sectionID);
            };
            
 
        };
        

    });
}
