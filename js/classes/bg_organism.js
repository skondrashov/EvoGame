function BgOrganism(traits)
{
	if (typeof(traits) === 'undefined')
		traits = [25, 127.5, 0, 0, 2*Math.PI];

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
		c.NUM_TRAITS = 5;

		// the traits are:
		// 1 - size
		// 2 - color
		// 3 - x speed
		// 4 - y speed
		// 5 - angle of rotation
		c.SIZE = 0;
		c.COLOR = 1;
		c.XSPEED = 2;
		c.YSPEED = 3;
		c.ROTATION = 4;

		c.MAX = new Array(c.NUM_TRAITS);
		c.MIN = new Array(c.NUM_TRAITS);
		c.MAX[c.SIZE] = 60;					// SIZE
		c.MIN[c.SIZE] = 4;
		c.MAX[c.COLOR] = 255;				// COLOR
		c.MIN[c.COLOR] = 0;
		c.MAX[c.XSPEED] = 20;				// XSPEED
		c.MIN[c.XSPEED] = -20;
		c.MAX[c.YSPEED] = 20;				// YSPEED
		c.MIN[c.YSPEED] = -20;
		c.MAX[c.ROTATION] = 3 * Math.PI;	// ROTATION
		c.MIN[c.ROTATION] = Math.PI;

		c.CHANGE_RATE = new Array(c.NUM_TRAITS);
		c.CHANGE_RATE[c.SIZE] = 5.5;
		c.CHANGE_RATE[c.COLOR] = 20;
		c.CHANGE_RATE[c.XSPEED] = 3;
		c.CHANGE_RATE[c.YSPEED] = 3;
		c.CHANGE_RATE[c.ROTATION] = .08;

		c.MUTATION_RATE = new Array(c.NUM_TRAITS);
		c.MUTATION_RATE[c.SIZE] = 1/1;
		c.MUTATION_RATE[c.COLOR] = 1/1;
		c.MUTATION_RATE[c.XSPEED] = 1/1;
		c.MUTATION_RATE[c.YSPEED] = 1/1;
		c.MUTATION_RATE[c.ROTATION] = 1/1;
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

	this.getColor = function()
	{
		return traits[c.COLOR];
	};

	this.getXSpeed = function()
	{
		return traits[c.XSPEED];
	};

	this.getYSpeed = function()
	{
		return traits[c.YSPEED];
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