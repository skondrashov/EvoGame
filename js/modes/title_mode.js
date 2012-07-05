function TitleMode(gs)
{
	var buttons = new Array();

	// the first 4 buttons are the main title screen buttons
	buttons[0] = gs.getImage['play_button'];
	buttons[1] = gs.getImage['options_button'];
	buttons[2] = gs.getImage['help_button'];
	buttons[3] = gs.getImage['about_button'];

	// the 

	this.init = function()
	{
		gs.loadMode(new LoadingMode (
			[
				[function(){
					gs.setMode('play');
				},'Loading play screen...']
			],gs),'loading');
		gs.setMode('loading');
	};

	function mainScreen()
	{
	}

	function optionsScreen()
	{
	}
	
	function helpScreen()
	{
	}
	
	function aboutScreen()
	{
	}

	this.destroy = function()
	{
		for (var k=0; k<buttons.length; k++)
			buttons[k].destroy();
		delete buttons;
	};
}