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
				menuSound.play();
				//music.stop();
				gs.loadMode(new LoadingMode([
						[function() {
							gs.clearLayout();
							gs.setMode('play');
							gs.unloadMode('title');
						},'Starting Game...']
					],gs),'load');
				gs.setMode('load');
				return;
			case 'options':
				menuSound.play();
				gs.setLayout('options');
				gs.setScreen(optionsScreen);
				return;
			case 'help':
				menuSound.play();
				gs.setLayout('help');
				gs.setScreen(helpScreen);
				return;
			case 'about':
				menuSound.play();
				gs.setLayout('about');
				gs.setScreen(aboutScreen);
				return;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayoutElement('title_text');
		gs.drawLayoutElement('play_button');
		gs.drawLayoutElement('options_button');
		gs.drawLayoutElement('help_button');
		gs.drawLayoutElement('about_button');
	}

	function optionsScreen()
	{
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0],gs.mousePosition[1])) {
			case 'fullscreen':
				menuSound.play();
				gs.style.border='none';
				gs.setResolution(gs.getWidth(),gs.getHeight(),true);
				break;
			case 'actual':
				menuSound.play();
				gs.style.border='ridge';
				gs.style.borderColor="#E0F080";
				gs.setResolution(gs.getWidth(),gs.getHeight());
				break;
			case 'back':
				menuSound.play();
				gs.setLayout('menu');
				gs.setScreen(mainScreen);
				return;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayoutElement('fullscreen_button');
		gs.drawLayoutElement('actual_button');
		gs.drawLayoutElement('back_button');
	}
	
	function helpScreen()
	{
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0],gs.mousePosition[1])) {
			case 'back':
				menuSound.play();
				gs.setLayout('menu');
				gs.setScreen(mainScreen);
				return;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayoutElement('help_text');
		gs.drawLayoutElement('back_button');
	}
	
	function aboutScreen()
	{
		if (gs.mousePressed) {
			switch (gs.getCollision(gs.mousePosition[0],gs.mousePosition[1])) {
			case 'back':
				menuSound.play();
				gs.setLayout('menu');
				gs.setScreen(mainScreen);
				return;
			}
		}
		gs.clearCollisionMap();
		gs.drawLayoutElement('about_text');
		gs.drawLayoutElement('back_button');
	}
}