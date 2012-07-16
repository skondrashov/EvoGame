function TitleMode(gs) {
	"use strict";
	var menuSound = gs.getSound('menu.wav');
	var music = gs.getSong('title.ogg');

	this.init = function() {
		gs.unloadMode('load');
		gs.setLayout('menu');
		gs.setScreen(mainScreen);
	//	music.play();
	};

	function mainScreen() {
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0], gs.mousePosition[1])) {
			case 'play':
				menuSound.stop();
				menuSound.play();
				music.stop();
				gs.loadMode(new LoadingMode([
						[function() {
							gs.clearLayout();
							gs.setMode('play');
							gs.unloadMode('title');
						},'Starting Game...']
					],gs),'load');
				gs.setMode('load');
				break;
			case 'options':
				menuSound.stop();
				menuSound.play();
				gs.setLayout('options');
				gs.setScreen(optionsScreen);
				break;
			case 'help':
				menuSound.stop();
				menuSound.play();
				gs.setLayout('help');
				gs.setScreen(aboutScreen);
				break;
			case 'about':
				menuSound.stop();
				menuSound.play();
				gs.setLayout('about');
				gs.setScreen(aboutScreen);
				break;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayout();
	}

	function optionsScreen()
	{
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0],gs.mousePosition[1])) {
			case 'fullscreen':
				menuSound.stop();
				menuSound.play();
				gs.style.border='none';
				gs.setResolution(gs.getWidth(),gs.getHeight(),true);
				break;
			case 'actual':
				menuSound.stop();
				menuSound.play();
				gs.style.border='ridge';
				gs.style.borderColor="#E0F080";
				gs.setResolution(gs.getWidth(),gs.getHeight());
				break;
			case 'back':
				menuSound.stop();
				menuSound.play();
				gs.setLayout('menu');
				gs.setScreen(mainScreen);
				break;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayout();
	}
	
	function helpScreen()
	{
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0],gs.mousePosition[1])) {
			case 'back':
				menuSound.stop();
				menuSound.play();
				gs.setLayout('menu');
				gs.setScreen(mainScreen);
				break;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayout();
	}
	
	function aboutScreen()
	{
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0],gs.mousePosition[1])) {
			case 'back':
				menuSound.stop();
				menuSound.play();
				gs.setLayout('menu');
				gs.setScreen(mainScreen);
				break;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayout();
	}

	this.destroy = function()
	{
		menuSound.destroy();
		music.destroy();
	};
}