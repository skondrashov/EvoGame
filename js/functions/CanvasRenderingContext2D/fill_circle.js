CanvasRenderingContext2D.prototype.fillCircle = function(x,y,r)
{
	this.beginPath();
	this.arc(x,y,r,0,6.2832);
	this.fill();
};