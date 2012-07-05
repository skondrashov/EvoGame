function ActiveOrganism(gs, size, color, xSpeed, ySpeed, rotation, x, y, id)
{
	var i,j; // iterator variables for use throughout the object
	var age = 0;
	var dead = false;
	var direction = 0;

	// var size
	// var x, y
	var roundX = 0, roundY = 0; 
	// var r
	var r, g, b;
	r = g = b = color;

	// static variables
	var c = ActiveOrganism;		// c is a reference to the class to simplify further code
	if (typeof(c.count) === 'undefined')			//checks if one of the static variables (arbitrary) isn't yet defined... if it is, no need to remake static variables
	{
		c.sprite = gs.getSprite('organism');
		c.deathSound = gs.getSound('organism_death.wav');
		c.sprite.setAnim('idle');
		// 'roots' gives an array of arrays of numbers to be used for drawing circles, so that redundant calculations don't have to be made in realtime.
		// roots[r][k] gives you the pixel thickness of a circle of radius r, k pixels away from the center
		// 1st array: {1}		= roots[0][0]
		// 2nd array: {2 1}		= roots[1][0] and roots[1][1]
		// 3rd array: {3 3 2}	= roots[2][...]
		// and so on. drawing each of the pixel values next to each other gives an approximation of a quarter-circle
		// note that any circles generated in this way ought to have even dimensions
		// the index roots[0] is intentionally left undefined, to make accessing the data easier. roots[r][k] will always access the information for a circle of radius r, which makes no sense for r=0
		c.roots = new Array(100+1);	//because roots[maxSize] needs to be defined, we treat our array as starting at 1 instead of 0, so the length needs to be +1
		for (i=1; i<c.roots.length; i++)
		{
			c.roots[i] = new Array(i);
			for (j=0; j<i; j++)
				c.roots[i][j] = Math.round(Math.sqrt(i*i-(j+0.5)*(j+0.5)));
		}
		c.count = 0;
	}
	c.count++;

	this.live = function(orgNum)
	{
		age++;

		if (x+size>=gs.getWidth())
			x-=size;
		if (x-size<=0)
			x+=size;
		if (y+size>=gs.getHeight())
			y-=size;
		if (y-size<=0)
			y+=size;
		if (x+xSpeed+size >= gs.getWidth() || x+xSpeed-size <= 0)
			xSpeed *= -1;
		else
			x += xSpeed;
		if (y+ySpeed+size >= gs.getHeight() || y+ySpeed-size <= 0)
			ySpeed *= -1;
		else
			y += ySpeed;
			
		direction+=rotation;

		roundX = 0|x;
		roundY = 0|y;
		for (var i=0; i<size; i++) // this code only works as long as the entirety of each organism is on the canvas. edit it later to clip the for loops at the edge of the canvas once the dudes start moving
		{
			var yBound = ActiveOrganism.roots[0|size][i];
			for (var j=roundY - yBound; j<roundY + yBound; j++)
			{
				gs.setCollision(roundX+i,j,orgNum);
				gs.setCollision(roundX-i-1,j,orgNum);
			}
		}
		
		draw();
	};

	function draw()
	{
		c.sprite.draw(roundX-size,roundY-size,false,direction,size/142);
	};

	this.kill = function()
	{
		c.deathSound.currentTime = 0;
		c.deathSound.play();
		this.dead = true;
	};

	this.isAlive = function()
	{
		return !(this.dead);
	};

	this.getColor = function()
	{
		return b;
	};

	this.getSize = function()
	{
		return size;
	};

	this.getXSpeed = function()
	{
		return xSpeed;
	};

	this.getXSpeed = function()
	{
		return ySpeed;
	};
	
	this.getRotation = function()
	{
		return rotation;
	};

	this.getID = function()
	{
		return id;
	};

	this.getAge = function()
	{
		return age;
	};

	this.destroy = function()
	{
		c.count--;
		if (c.count === 0)
		{
			c.deathSound.destroy();
			c.sprite.destroy();
			for (i=1; i<c.roots.length; i++)
				delete c.roots[i];
			delete c.roots;
		}
		delete this;
	};
}