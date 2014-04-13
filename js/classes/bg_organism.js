function BgOrganism(traits)
{
	var c = BgOrganism; // storing the class in a variable helps us to simplify any code involving static variables
						// anything preceded by 'c.' is a static variable that belongs to the class instead of to objects of the class
	var alive = true;
	var flag = false;

	// static variables
	if (typeof(c.NUM_TRAITS) === 'undefined')			//checks if one of the static variables (arbitrary) isn't yet defined... if it is, no need to remake static variables
	{
		// the static variables defined in this section give us parameters that define the way that mutation happens
		// NUM_TRAITS is the number of traits that every organism possesses
		// MUTATION_RATE defines the probability that a particular trait mutates during a mutation phase
		// CHANGE_RATE defines the maximumum change in a trait value if a trait does mutate
		// MAX and MIN define the maximum and minimum values that a trait can possess
		c.NUM_TRAITS = 3;

		// the traits are:
		// 1 - size
		// 2 - speed
		// 3 - rate of rotation
		c.SIZE = 0;
		c.SPEED = 1;
		c.ROTATION = 2;

		c.INITIAL_VALUE = new Array(c.NUM_TRAITS);
		c.INITIAL_VALUE[c.SIZE] = 50;
		c.INITIAL_VALUE[c.SPEED] = 0;
		c.INITIAL_VALUE[c.ROTATION] = 0;

		c.MAX = new Array(c.NUM_TRAITS);
		c.MIN = new Array(c.NUM_TRAITS);
		c.MAX[c.SIZE] = 100;				// SIZE
		c.MIN[c.SIZE] = 4;
		c.MAX[c.SPEED] = 18;				// SPEED
		c.MIN[c.SPEED] = -18;
		c.MAX[c.ROTATION] = 1;				// ROTATION
		c.MIN[c.ROTATION] = -1;

		c.CHANGE_RATE = new Array(c.NUM_TRAITS);
		c.CHANGE_RATE[c.SIZE] = 8;
		c.CHANGE_RATE[c.SPEED] = 3;
		c.CHANGE_RATE[c.ROTATION] = 1/6;

		c.MUTATION_RATE = new Array(c.NUM_TRAITS);
		c.MUTATION_RATE[c.SIZE] = 1/1;
		c.MUTATION_RATE[c.SPEED] = 1/1;
		c.MUTATION_RATE[c.ROTATION] = 1/1;
	}

	if (typeof(traits) === 'undefined') {
		traits = [];
		for (var k=0; k<c.NUM_TRAITS; k++)
			traits[k] = c.INITIAL_VALUE[k];
	}

	this.mutate = function()
	{
		for (var n=0; n<c.NUM_TRAITS; n++)
		{
			if (Math.random() < c.MUTATION_RATE[n])
			{
				var lBound, uBound;		// the bounds of the destination value of the trait
				lBound = traits[n] - c.CHANGE_RATE[n];
				uBound = traits[n] + c.CHANGE_RATE[n];
				if (lBound < c.MIN[n])
					lBound = c.MIN[n];
				if (uBound > c.MAX[n])
					uBound = c.MAX[n];
				traits[n] = Math.random()*(uBound-lBound)+lBound;
			}
		}
	};

	// GETTERS
	this.getTrait = function(n)
	{
		return traits[n];
	};

	this.getSize = function()
	{
		return traits[c.SIZE];
	};

	this.getSpeed = function()
	{
		return traits[c.SPEED];
	};
	
	this.getRotation = function()
	{
		return traits[c.ROTATION];
	};

	this.getFlag = function()
	{
		return flag;
	};

	this.isAlive = function()
	{
		return alive;
	};

	// SETTERS
	this.setFlag = function(bool)
	{
		flag = bool;
	};

	this.kill = function()
	{
		alive = false;
	};

	// DESTRUCTOR
	this.destroy = function()
	{
		delete this;
	};
}