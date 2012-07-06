function TitleMode(gs)
{
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
		for (img in Layouts.titleMenu)
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