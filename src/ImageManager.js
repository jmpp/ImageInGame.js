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