/**
 * @author : twitter@_jmpp / http://jmpp.fr
 **/

IIG.Animation = function(o) {

	this.frameCount = 0;

	this.sx = 0;
	this.sy = 0;
	this.sWidth = 0;
	this.sHeight = 0;
	this.animDirection = 'left2right'; // default direction is left to right
	this.animDirectionMultiplier = 1; // default is 1 : forward
	this.alternate = false;
	this.animByFrame = 12; // default 12
	this.pauseAnimation = false;

	// Fill animation properties with options
	if ('object' === typeof o)
	{
		this.sx = parseInt(o.sx) > 0 ? o.sx : this.sx;
		this.sy = parseInt(o.sy) > 0 ? o.sy : this.sy;
		this.sWidth = parseInt(o.sWidth) > 0 ? o.sWidth : this.sWidth;
		this.sHeight = parseInt(o.sHeight) > 0 ? o.sHeight : this.sHeight;
		this.animDirection = (o.animDirection && (o.animDirection === 'right2left' || o.animDirection === 'top2bottom' || o.animDirection === 'bottom2top')) ? o.animDirection : this.animDirection;
		this.animDirectionMultiplier = (o.animDirection && (o.animDirection === 'right2left' || o.animDirection === 'bottom2top')) ? -1 : 1;
		this.alternate = o.alternate || this.alternate;
		this.animByFrame = parseInt(o.animByFrame) > 0 ? o.animByFrame : this.animByFrame;
		this.pauseAnimation = o.pauseAnimation || this.pauseAnimation;
	}

}
