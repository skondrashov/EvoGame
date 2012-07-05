function debug(s)
{
	if (s === '')
	{
		document.getElementById('debug').innerHTML='';
	}else
	{
		//document.getElementById('debug').innerHTML=s;
		var p = document.createElement('div');
		p.innerHTML=(s);
		document.getElementById('debug').appendChild(p);
	}
}