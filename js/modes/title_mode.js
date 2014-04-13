function TitleMode(gs)
{
	var menuSound = gs.getSound('menu.wav');
	var button = function() {
		
	};

	this.init = function()
	{
		gs.unloadMode('load');
		gs.setLayout(GameState.layouts.titleMode.titleMenu);
		gs.setScreen(mainScreen);
	//	music.play();
	};

	function mainScreen()
	{
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0],gs.mousePosition[1])) {
			case 'play':
				menuSound.stop();
				menuSound.play();
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
				gs.setLayout(GameState.layouts.titleMode.titleOptions);
				gs.setScreen(optionsScreen);
				break;
			case 'help':
				menuSound.stop();
				menuSound.play();
				gs.setLayout(GameState.layouts.titleMode.titleHelp);
				gs.setScreen(aboutScreen);
				break;
			case 'about':
				menuSound.stop();
				menuSound.play();
				gs.setLayout(GameState.layouts.titleMode.titleAbout);
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
				gs.setResolution(gs.getWidth(),gs.getHeight());
				break;
			case 'back':
				menuSound.stop();
				menuSound.play();
				gs.setLayout(GameState.layouts.titleMode.titleMenu);
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
				gs.setLayout(GameState.layouts.titleMode.titleMenu);
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
				gs.setLayout(GameState.layouts.titleMode.titleMenu);
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
	};
}