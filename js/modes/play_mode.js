function PlayMode(MAX_BG_ORGS,MAX_SCREEN_ORGS,gs) {
	var MAX_SCREEN_TIME = 60 * 6;		// number of frames that each organism stays on screen before going back into the background population
	var GRAPH_SMOOTHNESS = 100;			// how many distinct regions each trait is considered to have (lower number = higher smoothness)
	var GRAPH_PRECISION = 500;			// how many decimal places of each trait are distinguished (high performance impact)

	var bgImg = gs.getImage('background.jpg');
	// ORGANISMS
	var bgOrgs = new BgPopulation(MAX_BG_ORGS);
	var actOrgs = new Array(MAX_SCREEN_ORGS);
	for (var i=0; i<MAX_SCREEN_ORGS; i++)
		loadNewOrganism(i);

	var health = 100;
	var score = 0;
	var frameCount = 0;				// the number of frames elapsed since playScreen began. only incremented in playScreen (in other screens, the game is considered paused)

	// STATISTICS
	var traitValues = new Array(BgOrganism.NUM_TRAITS);		// stores the number of possible integer values for every trait
	for (var i=0; i<BgOrganism.NUM_TRAITS; i++)
		traitValues[i] = 0|((BgOrganism.MAX[i]-BgOrganism.MIN[i]+.5)*GRAPH_PRECISION);


	this.init = function() {
		frameCount = 0;
		gs.setScreen(playScreen);
		showStats();
		fpsCounter = new FpsCounter(60);
	}

	function playScreen() {
		// INPUT
		if (gs.mousePressed) {						// if a player has clicked on an organism, kill it
			var orgNum = gs.getCollision(gs.mousePosition[0],gs.mousePosition[1]);
			if (orgNum !== null) {
				var o = actOrgs[orgNum];
				o.kill();
				bgOrgs.returnOrg(o);
				bgOrgs.reproduce();
				// score
				score += 100;
				health+=7;
				if (health>100)
					health = 100;
			}
		}
		gs.clearCollisionMap();

		// PROCESS
		bgImg.draw(0,0,false,0,gs.getHeight()/bgImg.height);

		for (var i=0; i<actOrgs.length; i++) {
			var o = actOrgs[i];
			if (o.isAlive()) {
				if (o.getAge() > MAX_SCREEN_TIME) {
					bgOrgs.returnOrg(o);
					loadNewOrganism(i);
				} else {
					o.live(i,gs);
				}
			} else
				loadNewOrganism(i);
		}

		if (!(frameCount%10))
			health-=2;
		document.getElementById('score').innerHTML='Health: ' + health + '<br/>Score: ' + score;
		if (!(frameCount%10))
			showStats();
		score++;
		if (health <= 0)
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
		gs.ctx.fillText("Game Over",gs.getWidth()/2,gs.getHeight()/2-100);

		gs.ctx.fillStyle="rgb(255,255,255)";
		gs.ctx.font="30px sans-serif";
		gs.ctx.fillText("Average Stats:",gs.getWidth()/2,gs.getHeight()/2-40);
		gs.ctx.font="20px sans-serif";
		gs.ctx.textAlign='right';
		gs.ctx.fillText("Size: ",gs.getWidth()/2-10,gs.getHeight()/2+0);
		gs.ctx.fillText("Speed: ",gs.getWidth()/2-10,gs.getHeight()/2+40);
		gs.ctx.fillText("Rotation: ",gs.getWidth()/2-10,gs.getHeight()/2+80);
		gs.ctx.textAlign='left';
		var mean;
		for (var i=0; i<3; i++)
		{
			mean = 0;
			for (var j=0; j<MAX_BG_ORGS; j++)
			{
				var o = bgOrgs.getOrg(j);
				if (o.isAlive())
					mean += Math.abs(o.getTrait(i)/MAX_BG_ORGS);
			}
			gs.ctx.fillText(mean,gs.getWidth()/2+10,gs.getHeight()/2+i*40);
		}

		gs.ctx.textAlign='center';
		gs.ctx.font="25px sans-serif";
		gs.ctx.fillText("Hit F5 to try again!",gs.getWidth()/2,gs.getHeight()/2+150);
		frameCount++;
	}
	
	function loadNewOrganism(n) {
		if (actOrgs[n])
			actOrgs[n].destroy();
		var id = bgOrgs.select();
		if (id !== false) {
			var o = bgOrgs.getOrg(id);
			actOrgs[n] = new ActiveOrganism(gs,o.getSize(),o.getSpeed(),o.getRotation(),id);
		} else {
			actOrgs[n] = new ActiveOrganism(gs);
			actOrgs[n].kill();
		}
	}

	this.destroy = function() {
		for (var i=0; i<MAX_SCREEN_ORGS; i++)
			actOrgs.destroy();
		for (var i=0; i<MAX_BG_ORGS; i++)
			bgOrgs.destroy();
		delete this;
	};

	function showStats() {
		var labels = [			// labels for our graphs, ordered by trait number
			'size',
			'speed',
			'rotation'];

		for (var i=0; i<BgOrganism.NUM_TRAITS; i++) {
			// distribution - the frequency of every value of the current trait in the population (decimal values rounded down)
			var distribution = new Array(traitValues[i]);
			for (var j=0; j<traitValues[i]; j++)
				distribution[j] = 0;

			for (var j=0; j<MAX_BG_ORGS; j++) {
				var o = bgOrgs.getOrg(j);
				if (o.isAlive()) {
					var traitValue = o.getTrait(i);
					if (i==1)
						traitValue = Math.abs(traitValue);
					distribution[0|(((traitValue - BgOrganism.MIN[i])*GRAPH_PRECISION)+.5)]++;
				}
			}
			var regions = new Array();
			for (var j=1; j<GRAPH_SMOOTHNESS; j++)
				regions.push(0|(distribution.length/GRAPH_SMOOTHNESS*j+.5));
			drawGraph(distribution, 'graph'+i, labels[i]+' distribution', regions, 0|(((BgOrganism.INITIAL_VALUE[i] - BgOrganism.MIN[i])*GRAPH_PRECISION)+.5));
			delete regions;
			delete distribution;
		}
	}
}