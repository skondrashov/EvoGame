function PlayMode(MAX_BG_ORGS,INITIAL_BG_ORGS,MAX_SCREEN_ORGS,gs)
{
	var ws;		// handle for websocket connections
	var music = gs.getSong('music.mp3');
	var bgImg = gs.getImage('background.jpg');;
	// ORGANISMS
	var bgOrgs = new BgPopulation(MAX_BG_ORGS,INITIAL_BG_ORGS);
	var actOrgs = new Array(MAX_SCREEN_ORGS);
	for (var i=0; i<MAX_SCREEN_ORGS; i++)
		loadNewOrganism(i);

	var fpsCounter;
	var frameCount = 0;									// the number of frames elapsed since playScreen began. only incremented in playScreen (in other screens, the game is considered paused)

	// SCORING
	var hunger = 0;
	var score = 0;


	this.init = function()
	{
		frameCount = 0;
		gs.setScreen(playScreen);
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
				if (o.getAge() > 60 * 3)
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
		document.getElementById('score').innerHTML='';
		writeScore('<br/>Hunger: ' + hunger);
		writeScore('Score: ' + (frameCount + score));
		if (hunger == 10)
			gs.setScreen(loseScreen);
		fpsCounter.count();
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
}