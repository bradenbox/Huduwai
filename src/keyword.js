var HashMap = require('hashmap');

var datapoints = new HashMap();

var probabilities = new HashMap();
var hyperConstant =  0.25;
var hypoConstant = 0.75;
var exactConstant = 1;
var logFactor = 2;

function Keyword(aWord) {
	this.word = aword;

	probabilities.put('"I don\'t know', 1);

	this.getWord = function() {
		return this.word;
	}

	this.addDatapoint = function(name, type) {
		if (datapoints.get(name) == null) {
			var arr1 = [];
			datapoints.put(name, arr1);
		}
		
		//if the match is on the exact word from the query
		if (type == null){
			datapoints.get(name).push(exactConstant);
		}
		else if (type.equals(Pointer.HYPERNYM)){ //if a hypernym
			datapoints.get(name).push(hyperConstant);
			
		}
		else if (type.equals(Pointer.HYPONYM)){ //if a hyponym
			datapoints.get(name).push(hypoConstant);
		}
		else{
			datapoints.get(name).push(exactConstant); //fall back for any other case. Shouldn't happen
		}
		
		recalculateProbabilities();
	}
	
	this.recalculateProbabilities = function() {
		var totalEntries = 0;
		//count the total number of datapoints added to memory for this keyword
		for(aKey in datapoints.keys()){
			totalEntries += datapoints.get(aKey).size();
		}
		
		//formula for determining how much to weight the 'unknown' due to lack of knowedge
		var uncertainty = 1/4*(1+logOfBase(logFactor, totalEntries));
		//the rest, naturally
		var certainty =  1 - uncertainty;
		
		var probabilities = new HashMap();
		
		//assign undercertainty 'to I don't know'
		probabilities.put(NO_ANSWER, uncertainty);
		
		var sumOfpoints = new HashMap();
		
		var totalSum = 0;
		//for each person, sum up weight of datapoints assigned to them
		for (aKey in datapoints.keys()){
			var allScores = datapoints.get(aKey);
			sum = 0;
			
			for (aScore in allScores){
				sum += aScore;
			}
			//store sum in temporary collection
			sumOfpoints.put(aKey, sum);
			totalSum += sum;
		}
		//adjust probability across size of certainty level proportial to total sum fo each person;
		for (aKey in datapoints.keys()){
			var adjustedProb = certainty*(sumOfpoints.get(aKey)/totalSum);
			probabilities.put(aKey, adjustedProb);
		}
	}

	this.logOfBase = function(base, num){
		return Math.log(num)/Math.log(base);
	}
}