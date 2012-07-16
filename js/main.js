/*try
{*/
	function main() {
		var gs = new GameState(600,400,60);
		if (gs.init('game_container')) {
			gs.loadMode(new LoadingMode(
				[
					[function() {
						gs.style.border="ridge";
						gs.style.borderColor="#E0F080";
						gs.style.cursor="crosshair";
						gs.loadMode(new PlayMode(
						20,		// The maximum size of the background population
						10,		// The number of organisms placed on the screen during each level
						gs),'play');
						gs.loadMode(new TitleMode(gs),'title');
						gs.setMode('title');
					},'Loading modes...']
				],gs),'loading');
			gs.setMode('loading');
			gs.start();
		}
		else {
			//this line contains the error message for HTML5 incompatibility, and also removes the tag from the main page which contains the javascript incompatibility error.
			container.innerHTML='It looks like your browser doesn\'t support HTML5. Please upgrade to a modern browser, such as the latest versions of <a href="https://www.google.com/chrome">Google Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a>.';
		}
	}
/*} catch (e)
{
	document.getElementById('game_container').innerHTML='Something went wrong in the game that shouldn\'t have. Please upgrade to a modern browser, such as the latest versions of <a href="https://www.google.com/chrome">Google Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a>. If you are already using a modern browser, then contact the developers to let them know what went wrong. The error that was generated is: <br/>'+ e.message;
}*/