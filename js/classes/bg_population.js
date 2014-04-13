function BgPopulation(MAX_ORGS)
{
	var i,j; // iterator variables for use throughout the object
	var orgs = new Array(MAX_ORGS);

	for (i=0; i<MAX_ORGS; i++)
		orgs[i] = new BgOrganism();

	var aliveArray = new Array(MAX_ORGS);		// this array serves to define the background organisms that are alive at the beginning of each reproduction phase.
													// with this we can avoid operations on organisms that are born during the frame

	var flaggedCount = 0;						// stores the number of unflagged organisms
	var aliveCount = MAX_ORGS;					// stores the number of alive organisms

	// FUNCTIONS


	// this function selects a random living and unflagged organism from the background organism population
	// first, we generate an integer, orgNum, between 0 and the number of organisms that are alive and unflagged
	// then, we look for living and unflagged organisms until we find orgNum of them.
	// we flag and return the location of the orgNumth organism
	this.select = function()
	{
		var orgNum = 0|(Math.random()*(aliveCount-flaggedCount));
		var numFound = 0;
		for (i=0; i<MAX_ORGS; i++) {
			if (orgs[i].isAlive() && !orgs[i].getFlag())
			{
				if (numFound == orgNum)
				{
					orgs[i].setFlag(true);
					flaggedCount++;
					return i;
				}
				numFound++;
			}
		}
		return false;
	};

	this.reproduce = function()
	{
		var failed = false;		// we need to use a trigger to break the loop instead of a 'break' statement to ensure that the parents' flags are properly off
		var momID, mom, dadID, dad;
		var traitNum, traits;
		while (aliveCount<MAX_ORGS && !failed)
		{
			momID = this.select();
			if (momID !== false)
			{
				mom = orgs[momID];
				dadID = this.select();
				if (dadID !== false)
				{
					dad = orgs[dadID];
					dad.setFlag(false);
					flaggedCount--;

					traitNum = BgOrganism.NUM_TRAITS;
					traits = new Array();
					for (i=0; i<traitNum; i++)
					{
						if (0|(Math.random()*2))
							traits.push(mom.getTrait(i));
						else
							traits.push(dad.getTrait(i));
					}

					for (i=0; i<MAX_ORGS; i++)
					{
						if (!orgs[i].isAlive())
						{
							orgs[i].destroy();
							orgs[i] = new BgOrganism(traits);
							orgs[i].mutate();
							aliveCount++;
							break;
						}
					}
					delete traits;
				} else		// if we cannot field a dad, we have to abort reproduction altogether
					failed = true;
				mom.setFlag(false);		// we deflag after attempting to find a dad in order to avoid the possibility that the mom and the dad are the same organism
				flaggedCount--;
			} else			// if we cannot field a mom, we have to abort reproduction altogether
				failed = true;
		}
	};

	this.returnOrg = function(o)
	{
		if (o.isAlive())
		{
			orgs[o.getID()].setFlag(false);
		}
		else
		{
			orgs[o.getID()].kill();
			aliveCount--;
		}
		flaggedCount--;
	};

	this.getOrg = function(n)
	{
		return orgs[n];
	};

	this.destroy = function()
	{
		for (i=0; i<MAX_ORGS; i++)
			orgs[i].destroy();
		orgs.destroy();
		aliveArray.destroy();
		delete this;
	};
}