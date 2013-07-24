/**
 * @description : Simple sprites and images management for HTML5 games
 * @author : twitter@_jmpp / http://jmpp.fr
 * @revision : 2
 **/

var IIG = IIG || {};

/**
 * @author : twitter@_jmpp / http://jmpp.fr
 **/

IIG.ImageManager = function() {

	this._filenames = [];
	this._sprites = [];
	this._spritesInstances = [];
	this._nbImagesLoaded = 0;
	this._callback = function() {};

	this.imagesLoaded = false;

}

IIG.ImageManager.prototype = {

	constructor : IIG.ImageManager,

	/**
	 * void ADD (String element1 [, String element2 [, String element3 [, ...]]])
	 * 	> Simply pushes one or several sprites in a local property
	 **/
	add : function() {

		if (arguments.length === 1)
			this._filenames.push(arguments[0]);
		else if (arguments.length > 1)
			for (var i = 0, c = arguments.length; i < c; i++)
				this._filenames.push(arguments[i]);

	},

	/**
	 * Object getInstance (String label)
	 * 	> Returns an instance of the sprite corresponding to "label"
	 **/
	getInstance : function(label) {

		var s = this._sprites[ label ];

		var instance = new IIG.Image({
			data : s.data,
			width : s.width,
			height : s.height,
			animation : s.animation
		});

		this._spritesInstances.push(instance);

		return instance;

	},

	/**
	 * Object killInstance (String label)
	 * 	> Kills the instance of the sprite corresponding to "label" and returns "undefined"
	 **/
	killInstance : function(inst) {

		// Killing the instance copied in the local property
		for (var i = 0, c = this._spritesInstances.length; i < c; i++) {
			if (this._spritesInstances[i] !== inst)
				continue;

			// Updates the possible instances which wouldn't be linked with this destruction
			this._spritesInstances[i].isDestroyed = true;

			if (this._spritesInstances[i].animation)
				delete this._spritesInstances[i].animation;
			
			this._spritesInstances.splice(i, 1);
			c--;
		}

		if (inst instanceof IIG.Image) {
			// Ensure this is killing the instance
			var tbl = [inst];
			tbl.splice(0, 1);
			inst = tbl = undefined;
		}

		return undefined;

	},

	/**
	 * void LOADALL (Function callback)
	 * 	> Creates and loads all sprites elements.
	 * 	> If 'callback' is specified, this function will be called when all sprites are loaded
	 **/
	loadAll : function(callback) {

		if ('function' === typeof callback)
			this._callback = callback;

		var that = this;
		for (var i = 0, c = this._filenames.length; i < c; i++) {
			var filename = this._filenames[i];
			// Creating a new image resource for this sprite
			var imageEl = new Image();
			imageEl.src = filename;
			imageEl.onload = function() {
				that.loaded(this);
			};

			// Getting the whole file path + name without the extension
			var label = /^(.*)\.(png|gif|jpg)$/ig.exec(filename)[1];
			// Saves the element's "label" into a data attribute
			imageEl.setAttribute('data-label', label);

			this._sprites[ label ] =
			{
				// width & height empty until image is loaded
				data : imageEl,
				width : 0,
				height : 0,
				animation : null
			};
		}
	},

	/**
	 * void LOADED (Event element)
	 * 	> NOT FOR USING OUTSIDE!
	 * 	> It just update the loaded image and update the counter.
	 **/
	loaded : function(element) {

		var label = element.getAttribute('data-label');

		// image is now loaded
		this._sprites[ label ].width = element.width;
		this._sprites[ label ].height = element.height;

		if (++this._nbImagesLoaded === IIG.Utils.count(this._sprites)) {
			this.imagesLoaded = true;
			this._callback();
		}

	},

	/**
	 * void UPDATE ()
	 * 	> Browse the sprites instances which have an animation and update their coordinates
	 **/
	update : function() {

		var sp, spa, posReset = false, startPoint, endPoint;
		for (var i = 0, c = this._spritesInstances.length; i < c; i++)
		{
			if (!this._spritesInstances[i] instanceof IIG.Image)
				continue;
			
			sp = this._spritesInstances[i];
			
			if ( !(sp.animation instanceof IIG.Animation) || (sp.animation.pauseAnimation || sp.pauseAnimation) )
				continue;

			if (sp.animationDestroyed) // In-case its would have been re-activated
				sp.animationDestroyed = false;

			spa = sp.animation;

			++spa.frameCount;

			// Updating only if frameCount is > to the predefined animation frame
			if (spa.frameCount < spa.animByFrame)
				continue;

			spa.frameCount = 0;

			// Avoid the problem of not showing the last state of the sprite when alternate is set to 'true'
			if (spa._resetAtNextState) {
				posReset = true;
				spa._resetAtNextState = false;
			}

			// HORIZONTAL animation (ltr and rtl)
			if (spa.animDirection === 'ltr' || spa.animDirection === 'rtl') {

				// If start point and/or end point have been defined ...
				startPoint = spa.startPoint || 0;
				endPoint = spa.endPoint || sp.width;

				// Moving sx
				spa.sx += spa.sWidth * spa._animDirectionMultiplier;

				// If 'alternate' is 'true', we'll only *-1 the multiplier to make 'sx' changes direction
				if (spa.alternate) {
					if (spa.sx <= startPoint || spa.sx + spa.sWidth >= endPoint) {
						spa._animDirectionMultiplier *= -1;
						spa._resetAtNextState = true;
					}
				}
				else {
					if (spa.animDirection === 'ltr') {
						if (spa.sx >= endPoint) {
							spa.sx = startPoint;
							posReset = true;
						}
					}
					else if (spa.animDirection === 'rtl') {
						if (spa.sx < startPoint) {
							spa.sx = endPoint - spa.sWidth;
							posReset = true;
						}
					}
				}
			}
			// VERTICAL animation (ttb and btt)
			else if (spa.animDirection === 'ttb' || spa.animDirection === 'btt') {
				
				// If start point and/or end point have been defined ...
				startPoint = spa.startPoint || 0;
				endPoint = spa.endPoint || sp.height;

				// Moving sy
				spa.sy += spa.sHeight * spa._animDirectionMultiplier;

				// If 'alternate' is 'true', we'll only *-1 the multiplier to make 'sx' changes direction
				if (spa.alternate) {
					if (spa.sy <= startPoint || spa.sy + spa.sHeight >= endPoint) {
						spa._animDirectionMultiplier *= -1;
						spa._resetAtNextState = true;
					}
				}
				else {
					if (spa.animDirection === 'ttb') {
						if (spa.sy >= endPoint) {
							spa.sy = startPoint;
							posReset = true;
						}
					}
					else if (spa.animDirection === 'btt') {
						if (spa.sy < startPoint) {
							spa.sy = endPoint - spa.sHeight;
							posReset = true;
						}
					}
				}
			}

			// It's time to check if max iterations has been reached, and if so, destroy the instance...
			if (posReset) {
				if ('number' === typeof spa.iterations) {
					if (++spa._iterationsCount >= spa.iterations) {
						//sp = this.killInstance( this._spritesInstances[i] );
						this._spritesInstances[i].animation = spa = undefined;
						this._spritesInstances[i].animationDestroyed = true;
					}
				}

				posReset = false;
			}
		
		
		}

	},

	/**
	 * bool DRAWIMAGE (Object context, Object image, float x, float y)
	 * 	> Shortcut method to draw a sprite using its pre-computed coordinates
	 **/
	drawImage : function(context, sprite, x, y) {

		if (sprite.animation instanceof IIG.Animation)
			return context.drawImage(sprite.data, sprite.animation.sx, sprite.animation.sy, sprite.animation.sWidth, sprite.animation.sHeight, x, y, sprite.animation.sWidth, sprite.animation.sHeight);
		else
			return context.drawImage(sprite.data, x, y);

	}

};

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

/**
 * @author : twitter@_jmpp / http://jmpp.fr
 **/

IIG.Utils = {

	/**
	 * int COUNT (Object obj)
	 * 	> Return the number of properties of a litteral object
	 **/
	count : function(obj) {
		
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;

	}

};