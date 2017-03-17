var name;
var type;

function Pointer() {
	
	this.getName = function() {
		return this.name;
	}

	this.getPointerType = function() {
		return this.type;
	}

	this.setName = function(aName) {
		this.name = aName;
	}

	this.setType = function(aType) {
		this.type = aType;
	}
}