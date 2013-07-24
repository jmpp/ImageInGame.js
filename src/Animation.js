/**
 * @author : twitter@_jmpp / http://jmpp.fr
 **/

IIG.Animation = function(o) {

	this.frameCount = 0;

	this.sx = 0;
	this.sy = 0;
	this.sWidth = 0;
	this.sHeight = 0;
	this.animDirection = 'ltr'; // default direction is left to right
	this._animDirectionMultiplier = 1; // default is 1 : forward
	this.alternate = false;
	this.animByFrame = 12; // default 12
	this.pauseAnimation = false;
	this.iterations = 'infinite'; // number of iterations (infinite by default)
	this._iterationsCount = 0;
	this._resetAtNextState = false;
	this.startPoint = 0;
	this.endPoint = 0;

	// Fill animation properties with options
	if ('object' === typeof o)
	{
		this.sx = parseInt(o.sx) > 0 ? o.sx : this.sx;
		this.sy = parseInt(o.sy) > 0 ? o.sy : this.sy;
		this.sWidth = parseInt(o.sWidth) > 0 ? o.sWidth : this.sWidth;
		this.sHeight = parseInt(o.sHeight) > 0 ? o.sHeight : this.sHeight;
		if (o.animDirection)
		{
			// Handling old versions values 'left2right', 'right2left', 'top2bottom' and 'bottom2top'
			if (o.animDirection === 'right2left' || o.animDirection === 'left2right' || o.animDirection === 'top2bottom' || o.animDirection === 'bottom2top')
				console.warn("`ImageInGame` - Value '"+ o.animDirection +"' is deprecated. Use instead 'rtl', 'ltr', 'ttb' or 'btt'");
			o.animDirection = (o.animDirection === 'right2left') ? 'rtl' : o.animDirection;
			o.animDirection = (o.animDirection === 'left2right') ? 'ltr' : o.animDirection;
			o.animDirection = (o.animDirection === 'top2bottom') ? 'ttb' : o.animDirection;
			o.animDirection = (o.animDirection === 'bottom2top') ? 'btt' : o.animDirection;

			if (o.animDirection === 'rtl' || o.animDirection === 'ltr' || o.animDirection === 'ttb' || o.animDirection === 'btt')
				this.animDirection = o.animDirection;

			this._animDirectionMultiplier = (o.animDirection === 'rtl' || o.animDirection === 'btt') ? -1 : 1;
		}
		this.alternate = o.alternate || this.alternate;
		this.animByFrame = parseInt(o.animByFrame) > 0 ? o.animByFrame : this.animByFrame;
		this.pauseAnimation = o.pauseAnimation || this.pauseAnimation;
		this.iterations = o.iterations || this.iterations;
		this.startPoint = o.startPoint || 0;
		this.endPoint = o.endPoint || 0;

		// Avoid the animation to firstly start at 0 if a start point is defined
		if (this.startPoint > 0) {
			if (this.animDirection === 'ltr' || this.animDirection === 'rtl')
				this.sx = this.startPoint;
			else if (this.animDirection === 'ttb' || this.animDirection === 'btt')
				this.sy = this.startPoint
		}
	}

}
