Audio.prototype.stop = function()
{
	this.pause();
	this.currentTime = 0;
};