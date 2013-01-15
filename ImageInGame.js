/**
 * ImageInGame.js
 * --
 * @description : Simple sprites and images management for HTML5 games
 * @author : twitter@_jmpp / http://jmpp.fr
 **/

function ImageInGame()
{
	this.assets = [];
	this.images = [];
	this.nbImagesLoaded = 0;
	this.imagesLoaded = false;
	this.callback = function() {};

	/**
	 * void ADD (String|Object element1 [, String|Object element2 [, String|Object element3 [, ...]]])
	 * 	> Simply pushes one or several images in a local property
	 **/
	this.add = function() {

		if (arguments.length === 1)
			this.assets.push(arguments[0]);
		else if (arguments.length > 1)
			for (var i = 0, c = arguments.length; i < c; i++)
				this.assets.push(arguments[i]);

	};

	/**
	 * Object GET (String label)
	 * 	> Getter which returns the element corresponding to 'label'
	 **/
	this.get = function(label) {

		return this.images[ label ];

	};

	/**
	 * void LOADALL (Object o)
	 * 	> Creates and loads all images elements.
	 * 	> If o.callback is specified, this function will be called when all images are loaded
	 **/
	this.loadAll = function(o) {

		if ('object' === typeof o && 'function' === typeof o.callback)
			this.callback = o.callback;

		var that = this;
		for (var i = 0, c = this.assets.length; i < c; i++) {
			
			var a = this.assets[i],
				filename, sx, sy, sWidth, sHeight, animDirection;

			filename = 'object' === typeof a ? a.filename : a;
			sx = parseInt(a.sx) > 0 ? a.sx : 0;
			sy = parseInt(a.sy) > 0 ? a.sy : 0;
			sWidth = parseInt(a.sWidth) > 0 ? a.sWidth : 0;
			sHeight = parseInt(a.sHeight) > 0 ? a.sHeight : 0;
			animDirection = a.animDirection || null;
			animByFrame = parseInt(a.animByFrame) > 0 ? a.animByFrame : 10;
			
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

			this.images[ label ] =
			{
				data : imageEl,
				width : 0, // Currently empty because the image isn't fully loaded
				height : 0, // Currently empty because the image isn't fully loaded
				sx : sx,
				sy : sy,
				sWidth : sWidth,
				sHeight : sHeight,
				animDirection : animDirection,
				animByFrame : animByFrame,
				frameCount : 0
			};

		}

	};

	/**
	 * void LOADED (Event element)
	 * 	> NOT FOR USING OUTSIDE! It just update the loaded image and update the counter.
	 **/
	this.loaded = function(element) {

		var label = element.getAttribute('data-label');

		// As this image is now loaded, we can fill its width & height
		this.images[ label ].width = element.width;
		this.images[ label ].height = element.height;

		// If sWidth and sHeight weren't specified, fill them with width & height
		if (this.images[ label ].sWidth === 0)
			this.images[ label ].sWidth = element.width;
		if (this.images[ label ].sHeight === 0)
			this.images[ label ].sHeight = element.height;

		if (++this.nbImagesLoaded === this.countProperties(this.images)) {
			this.imagesLoaded = true;
			this.callback();
		}

	};

	/**
	 * void UPDATE ()
	 * 	> Manages the sprite cooordinates (if any) for the animation of each element
	 **/
	this.update = function() {

		for (var i in this.images) {
			if (this.images.hasOwnProperty(i)) {
				
				var img = this.images[i];
				
				if (img.animDirection !== null)
				{
					++img.frameCount;

					if (img.frameCount >= img.animByFrame) {
						img.frameCount = 0;

						if (img.animDirection === 'horizontal') {
							img.sx += img.sWidth;

							if (img.sx >= img.width)
								img.sx = 0;
						}
						if (img.animDirection === 'vertical') {
							img.sy += img.sHeight;
	 
							if (img.sy >= img.height)
								img.sy = 0;
						}
					}
				}
					
			}
		}

	};

	/**
	 * bool DRAWIMAGE (Object context, Object image, float x, float y)
	 * 	> Shortcut method to draw a sprite using its pre-computed coordinates
	 **/
	this.drawImage = function(context, image, x, y) {

		if ('object' !== typeof context)
			throw new Error('ImageInGame.drawImage() : argument sent doesn\'t seems to be a valid 2d context.');

		return context.drawImage(image.data, image.sx, image.sy, image.sWidth, image.sHeight, x, y, image.sWidth, image.sHeight);

	};

	/* ============= Utils ============= */

	/**
	 * int COUNTPROPERTIES (Object obj)
	 * 	> Return the number of properties of a litteral object
	 **/
	this.countProperties = function(obj) {
		
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;

	};

};