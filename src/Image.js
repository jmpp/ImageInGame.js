/**
 * @author : twitter@_jmpp / http://jmpp.fr
 **/

IIG.Image = function(o) {

	// Fill image properties with options
	if ('object' === typeof o)
	{
		this.data = o.data;
		this.width = o.width;
		this.height = o.height;
		this.animation = o.animation;
		this.pauseAnimation = (o.animation instanceof IIG.Animation) ? o.animation.pauseAnimation : false;
		this.animationDestroyed = false;
		// this._warned = false;
	}

}