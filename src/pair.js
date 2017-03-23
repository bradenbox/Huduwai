var first;
var second;

function Pair()  {
	this.setFirst = function (aValue) {
		this.first = aValue;
	}

	this.setSecond = function(aValue) {
		this.second = aValue;
	}

    this.getFirst = function() {
    	return this.first;
    }

    this.getSecond = function() {
    	return this.second;
    }
}