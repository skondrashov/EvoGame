function PlayMode(MAX_BG_ORGS,INITIAL_BG_ORGS,MAX_SCREEN_ORGS,gs)
{
	var ws;		// handle for websocket connections
	var music = gs.getSong('music.mp3');
	var bgImg = gs.getImage('background.jpg');;
	var SHOW_STATISTICS = true;
	// ORGANISMS
	var bgOrgs = new BgPopulation(MAX_BG_ORGS,INITIAL_BG_ORGS);
	var actOrgs = new Array(MAX_SCREEN_ORGS);
	for (var i=0; i<MAX_SCREEN_ORGS; i++)
		loadNewOrganism(i);

	var frameCount = 0;									// the number of frames elapsed since playScreen began. only incremented in playScreen (in other screens, the game is considered paused)

	// SCORING
	var hunger = 0;
	var score = 0;

	// STATISTICS
	if (SHOW_STATISTICS)
	{
		var TOTAL_TRAITS = 5;							// 0 == size, 1 == color, 2 == xspeed, 3 == yspeed, 4 == rotation
		//var fitness = new Array(TOTAL_TRAITS);
		//var traits = new Array(TOTAL_TRAITS);
		var traitValues = new Array(TOTAL_TRAITS);		// stores the number of possible integer values for every trait
		//var killed = new Array(TOTAL_TRAITS);			// marks how many organisms with a particular trait are killed between updates of the fitness graphs
		//var means = new Array(TOTAL_TRAITS); 			// stores the average value of each trait throughout the population
		for (var i=0; i<TOTAL_TRAITS; i++)
		{
			//traits[i] = new Array();
			//means[i] = 0;
			traitValues[i] = 0|(BgOrganism.MAX[i]-BgOrganism.MIN[i] + 1);
			//killed[i] = new Array(traitValues[i]);
			//fitness[i] = new Array(traitValues[i]);
			for (var j=0; j<traitValues[i]; j++)
			{
		//		killed[i][j] = 0;
		//		fitness[i][j] = 0;
			}
		}
	}

	this.init = function()
	{
	//	ws = new WebSocket('ws://172.17.35.102:1337');
		frameCount = 0;
		gs.setScreen(playScreen);
		showStats();
		fpsCounter = new FpsCounter(60);
	//	music.play();
	}

	function playScreen()
	{
		// INPUT
		if (gs.mousePressed)						// if a player has clicked on an organism, kill it
		{
			var orgNum = gs.getCollision(gs.mousePosition[0],gs.mousePosition[1]);
			if (orgNum !== null)
			{
				var o = actOrgs[orgNum];
				o.kill();
				bgOrgs.returnOrg(o);
				bgOrgs.reproduce();
				// score
				score += 100;
				hunger--;
				if (hunger < 0)
					hunger = 0;
				// stats
				if (SHOW_STATISTICS)
				{
					o = bgOrgs.getOrg(o.getID());
					for (var i=0; i<TOTAL_TRAITS; i++)
						;//killed[i][0|((o.getTrait(i)-BgOrganism.MIN[i])+.5)]++;
				}
			}
		}
		gs.clearCollisionMap();

		// PROCESS
		bgImg.draw(0,0,false,0,gs.getHeight()/bgImg.height);

		for (var i=0; i<actOrgs.length; i++)
		{
			var o = actOrgs[i];
			if (o.isAlive())
			{
				if (o.getAge() > 60 * 5)
				{
					bgOrgs.returnOrg(o);
					loadNewOrganism(i);
				} else
				{
					o.live(i,gs);
				}
			} else
				loadNewOrganism(i);
		}

		if (!(frameCount%60))
			hunger+=1;
		if (SHOW_STATISTICS && !(frameCount%10))
			showStats();
		document.getElementById('score').innerHTML='';
		writeScore('<br/>Hunger: ' + hunger);
		writeScore('Score: ' + (frameCount + score));
		if (hunger == 10)
			gs.setScreen(loseScreen);
		fpsCounter.show(frameCount);
		frameCount++;
	}

	function loseScreen()
	{
		gs.ctx.textAlign="center";
		gs.ctx.textBaseline="middle";
		
		gs.ctx.font="50px sans-serif";
		gs.ctx.fillStyle="rgb(200,60,60)";
		gs.ctx.fillText("You lose!",gs.getWidth()/2,gs.getHeight()/2-100);

		gs.ctx.font="30px sans-serif";
		gs.ctx.fillStyle="rgb(255,255,255)";
		gs.ctx.fillText("You must eat a tasty circle",gs.getWidth()/2,gs.getHeight()/2-45);
		gs.ctx.fillText("every second to stay alive.",gs.getWidth()/2,gs.getHeight()/2-10);

		gs.ctx.font="20px sans-serif";
		gs.ctx.fillText("Organism Stats:",gs.getWidth()/2,gs.getHeight()/2+20);
		gs.ctx.font="15px sans-serif";
		gs.ctx.fillText("Size: ",gs.getWidth()/2-55,gs.getHeight()/2+40);
		gs.ctx.fillText("Color: ",gs.getWidth()/2-55,gs.getHeight()/2+60);
		gs.ctx.fillText("X Speed: ",gs.getWidth()/2-55,gs.getHeight()/2+80);
		gs.ctx.fillText("Y Speed: ",gs.getWidth()/2-55,gs.getHeight()/2+100);
		gs.ctx.fillText("Rotation: ",gs.getWidth()/2-55,gs.getHeight()/2+120);
		var mean;
		for (var i=0; i<5; i++)
		{
			mean = 0;
			for (var j=0; j<MAX_BG_ORGS; j++)
			{
				var o = bgOrgs.getOrg(j);
				if (o.isAlive())
					mean += Math.abs(o.getTrait(i)/MAX_BG_ORGS);
			}
			gs.ctx.fillText(mean,gs.getWidth()/2+55,gs.getHeight()/2+i*20+40);
		}

		gs.ctx.font="25px sans-serif";
		gs.ctx.fillText("Hit F5 to try again!",gs.getWidth()/2,gs.getHeight()/2+150);
		frameCount++;
	}

	function loadNewOrganism(n)
	{
		if (actOrgs[n])
			actOrgs[n].destroy();
		var id = bgOrgs.select();
		if (id !== false)
		{
			var o = bgOrgs.getOrg(id);
			actOrgs[n] = new ActiveOrganism(gs,o.getSize(),o.getColor(),o.getXSpeed(),o.getYSpeed(),o.getRotation(),0|(Math.random()*gs.getWidth()),0|(Math.random()*gs.getHeight()), id);
		} else
		{
			actOrgs[n] = new ActiveOrganism(gs);
			actOrgs[n].kill();
		}
	}

	this.destroy = function()
	{
		for (var i=0; i<MAX_SCREEN_ORGS; i++)
			actOrgs.destroy();
		for (var i=0; i<MAX_BG_ORGS; i++)
			bgOrgs.destroy();
		music.destroy();
		delete this;
	};

	function writeScore(s)
	{
		var p = document.createElement('div');
		p.innerHTML=s;
		document.getElementById('score').appendChild(p);
	}

	function showStats()
	{
		var labels = [			// labels for our graphs, ordered by trait number
			'size',
			'color',
			'x speed',
			'y speed',
			'rotation'];
		var numRegions = 100;	// how many distinct regions each trait is considered to have

		for (var i=0; i<TOTAL_TRAITS; i++)
		{
			// distribution - the frequency of every value of the current trait in the population (decimal values rounded down)
			var distribution = new Array(traitValues[i]*100);
			for (var j=0; j<traitValues[i]*100; j++)
				distribution[j] = 0;
			//means[i] = 0;	// the average value of the current trait in the population

			for (var j=0; j<MAX_BG_ORGS; j++)
			{
				var o = bgOrgs.getOrg(j);
				if (o.isAlive())
				{
					var traitValue = o.getTrait(i);
					//means[i] += traitValue/MAX_BG_ORGS;			// Math.abs optional
					distribution[0|(((traitValue - BgOrganism.MIN[i]) * 100)+.5)]++;
				}
			}
			//traits[i].push(means[i]);
			/*for (var j=0; j<traitValues[i]; j++)
			{
				if (distribution[j] || killed[i][j])
					fitness[i][j] += distribution[j] / (distribution[j]+killed[i][j]);
				else
					fitness[i][j] += 0;	// this else statement should only trigger if we have 0 of a trait survived over 0 occurences of the trait in the population. 0/0 is undefined, but we'll let it be 0
				killed[i][j] = 0;
			}*/
			var regions = new Array();
			for (var j=1; j<numRegions; j++)
				regions.push(0|(distribution.length/numRegions*j+.5));
//			drawGraph(fitness[i], document.getElementById('graph'+((2*(i+1))+7)).getContext("2d"), labels[i]+' fitness with ' + numRegions + ' regions', regions);
//			drawGraph(fitness[i], document.getElementById('graph'+((2*(i+1))+8)).getContext("2d"), labels[i]+' fitness w/o regions');
			drawGraph(distribution, 'graph'+(((2*i+1))), labels[i]+' distribution', regions);
			delete regions;
			delete distribution;
//			drawGraph(traits[i],document.getElementById('graph'+(2*(i+1))).getContext("2d"),labels[i]);
		}		
		// might need garbage collection here... but not really necessary since this function leaks memory no matter what. the final product won't have this function regardless
	}
}