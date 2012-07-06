function FpsCounter(frameCount)
{
	var interval = 0;
	var prevFrameCount;
	this.hide = function()
	{
		delete prevFrameCount;
		interval = 0;
		clearInterval(interval);
		document.getElementById('framerate').innerHTML='';
	};
	this.show = function(perSecond)
	{
		delete prevFrameCount;
		if (perSecond===0)
			this.hide();
		else
		{
			var index = 0;
			var prevFrameCount = new Array(perSecond);
			for (var k=0;k<perSecond;k++)
				prevFrameCount[k] = 0;
			interval = setInterval(function(){
					document.getElementById('framerate').innerHTML='FPS: ' + (frameCount-prevFrameCount[index]);
					prevFrameCount[index]=frameCount;
					index++;
					if (index == perSecond)
						index = 0;
				},1000/perSecond);
		}
	};
}