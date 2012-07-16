// a - the array that contains the values to graph
// c - the id of the canvas element that the graph is to be drawn on
// regions is an array that allows the drawGraph function to reduce the resolution it displays at
	// the length of the array 'a' is broken up into regions, and the average value of each region is graphed for every element in that region
	// for example, if a == [0,1,2,3,4,5] , and regions == [2,5], then the function will graph as if a == [1,1,1,4,4,4]
	// it is important to note that [2,5] is NOT equivalent to [0,2,5]
	// in the latter case, the 0th element will be considered its own region, but in the former, elements 0, 1, and 2 will belong to a single region
	// it is also important to note that if the last element of 'regions' is not the length of a, then the remaining elements of a will be considered as a single region
	// eg if a == [0,1,2,3,4,5], then regions == [2,5] will draw an identical graph to regions == [2]
// label is a label that is drawn on the graph
function drawGraph(a, c, label, regions, mark)
{
	c = document.getElementById(c).getContext("2d");
	var k;	// iterator variable for use throughout the function
	a = a.slice(0);		// copy the received data into a new array to avoid changing the data
	var LMARGIN, TMARGIN, RMARGIN, BMARGIN; // left top right bottom margins
	LMARGIN = RMARGIN = 30;
	TMARGIN = BMARGIN = 20;
	// outline the graph and label it
	c.strokeStyle='rgb(255,255,255)';
	c.clearRect(0,0,c.canvas.width,c.canvas.height);
	c.strokeRect(0,0,c.canvas.width,c.canvas.height);
	if (label)
	{
		c.font='12px Arial';
		c.textAlign='right';
		c.textBaseline='bottom';
		c.strokeText(label,c.canvas.width-RMARGIN, TMARGIN);
	}
	if (a.length === 0)		// we stop here if an empty array was provided
		return;

	var ARRAY_WIDTH = a.length;
	if (regions)
	{
		function processRegion(regBegin, regEnd)
		{
			var regLength = 0;
			var regTotal = 0;
			for (var k=regBegin; k<regEnd; k++)
			{
				regLength++;
				regTotal += a[k];
			}
			var regAvg = regTotal/regLength;
			for (k=regBegin; k<regEnd; k++)
				a[k] = regAvg;
		}
		processRegion(0,regions[0]);
		for (k=1; k<regions.length; k++)
			processRegion(regions[k-1],regions[k]);
		processRegion(regions[regions.length-1],ARRAY_WIDTH);
	}

	var ORIGIN;
	ORIGIN = [LMARGIN,c.canvas.height-TMARGIN];

	var MAX_VALUE = a[0];
	var MIN_VALUE = a[0];
	for (k=0; k<ARRAY_WIDTH; k++)
	{
		if (MAX_VALUE < a[k])
			MAX_VALUE = a[k];
		if (MIN_VALUE > a[k])
			MIN_VALUE = a[k];
	}
	c.font='12px Arial';
	c.textAlign='right';
	c.textBaseline='hanging'; 
	c.strokeText(0|MAX_VALUE,LMARGIN,TMARGIN);
	c.textBaseline='alphabetic'; 
	c.strokeText(0|MIN_VALUE,LMARGIN,c.canvas.height-BMARGIN);
	c.textAlign='left';
	c.textBaseline='hanging';
	c.strokeText(0,LMARGIN,c.canvas.height-BMARGIN);
	c.strokeText(ARRAY_WIDTH-1,c.canvas.width-RMARGIN,c.canvas.height-BMARGIN);

	var ARRAY_HEIGHT = MAX_VALUE - MIN_VALUE;
	
	GRAPH_WIDTH = c.canvas.width - LMARGIN - RMARGIN;
	GRAPH_HEIGHT = c.canvas.height - TMARGIN - BMARGIN;
	
	var PIXEL_WIDTH = GRAPH_WIDTH/ARRAY_WIDTH;
	var PIXEL_HEIGHT = GRAPH_HEIGHT/ARRAY_HEIGHT;

	/*
	// this is the pixel opacity method; pixel width is inversely proportional to the opacity of each point placed
	// ideally, this should result in best display of fine details in graphs with much larger dimensions of the array than of the canvas
	var imgData=graphCtx.createImageData(GRAPH_WIDTH,GRAPH_HEIGHT);
	for (var k=0;k<GRAPH_WIDTH*GRAPH_HEIGHT*4;k+=4)
	
	for (var k=0; k<ARRAY_WIDTH; k++)
	{
		
	}
	
	var colorInc;
	if (PIXEL_WIDTH < 1)
		colorInc = 255*PIXEL_WIDTH;
	else
		colorInc = 255;*/
		
	// this is the pixel remainder method; pixels are crunched together in regular intervals, resulting in crisp display but with some loss of detail.
	
	// this is the path method, connecting the points of the graph with straight lines (great for canvasses larger than arrays)
	c.lineWidth=0;
	c.beginPath();
	c.moveTo(ORIGIN[0],(-1)*(0|(PIXEL_HEIGHT*(a[0]-MIN_VALUE)))+ORIGIN[1]);
	for (k=1; k<ARRAY_WIDTH; k++)
	{
		var value = a[k];
		c.lineTo(0|(k*PIXEL_WIDTH)+ORIGIN[0],(-1)*(0|(PIXEL_HEIGHT*(value-MIN_VALUE)))+ORIGIN[1]);
	}
	c.stroke();
	c.strokeStyle='#FF0000';
	if (mark) {
		c.beginPath();
		c.moveTo(0|(mark*PIXEL_WIDTH)+ORIGIN[0],5+c.canvas.height-BMARGIN);
		c.lineTo(0|(mark*PIXEL_WIDTH)+ORIGIN[0],TMARGIN-5);
		c.stroke();
	}
	delete a;	// delete the copied array (not the original array passed into the function)
}