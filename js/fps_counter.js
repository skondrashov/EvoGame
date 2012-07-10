function FpsCounter(precision)
{
	var counts = new Array(precision);
	var time, oldTime = new Date();
	var index = 0;
	var elapsed;
	this.show = function()
	{
		elapsed=0;
		oldTime = time;
		delete time;
		time = new Date();
		counts[index] = time.valueOf()-oldTime.valueOf();
		delete oldTime;
		for (oldTime=0;oldTime<precision;oldTime++)		// we're done with oldTime, so we can use it as an iterator
			elapsed+=counts[oldTime];
		document.getElementById('framerate').innerHTML='FPS: ' + ((0|(10000*precision/elapsed+.5))/10);
		index++;
		if (index == precision)
			index = 0;
	};
}