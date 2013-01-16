ImageInGame.js
==============

Image In Game is a simple sprites and images management tool for HTML5 games.

**Summary**

1. [Getting started](#1-getting-started)
2. [Add images](#2-add-images)
 * [Simple images](#simple-images)
 * [Sprites](#sprites)
3. [Images loading](#3-images-loading)
4. [Animation update](#4-animation-update)
5. [Drawing images](#5-drawing-images)
6. [Pausing animation](#6-pausing-animation)
7. [Full example](#7-full-example)

1. Getting started
---------------

In order to get started, include `ImageInGame.js` in your document and instanciate it :

```javascript
var IIG = new ImageInGame();
```

2. Add images
---------------------

### Simple images

You can add one or several images at once, depending on your needs :

```javascript
IIG.add('img/player.png');
IIG.add('img/rock.png');
// ...
```

or

```javascript
IIG.add('img/player.png', 'img/rock.png', ...);
```

### Sprites

Let's consider this sprite representing a Bob guy :

![bob](https://raw.github.com/jmpp/ImageInGame.js/master/bob.png) (C) by ([hexapode](https://github.com/hexapode))

Each state of Bob is in a canvas of 48 x 64 pixels. We'll start with the "down" state of Bob and with the middle canvas :

![bob measures](https://raw.github.com/jmpp/ImageInGame.js/master/bob_measures.png)

With this informations, you must add the sprite this way :

```javascript
IIG.add({
  filename : 'img/bob.png',
  sWidth : 48,
  sHeight : 64,
  sx : 48,
  sy : 64 * 2,
  animDirection : 'left2right',
  alternate : true,
  animByFrame : 10
});
```

* `sWidth` and `sHeight` corresponds to the width and height of the canvas area which will be displayed. If not specified, they'll be automatically replaced with the whole image width and height.

* `sx` and `sy` corresponds to the coordinates of the canvas within the image. If not specified, they'll be automatically set to 0

* The `animDirection` property can take 4 values : `'left2right'` (by default), `'right2left'`, `'top2bottom'` and `'bottom2top'`. It will specify how the canvas will move within the animation.

* The `alternate` property is a boolean which defines if the animation should alternate its direction when over :
  
  ![non alternate](https://raw.github.com/jmpp/ImageInGame.js/master/bob_non_alternate.gif) `alternate : false` (default value)
  
  ![alternate](https://raw.github.com/jmpp/ImageInGame.js/master/bob_alternate.gif) `alternate : true`
  
  Note that if set to `true`, there will be 2 cases :
  
      1. The alternation will be HORIZONTAL if you've previously defined `animDirection` to `'left2right'` or `'right2left'`.
      2. The alternation will be VERTICAL if you've previously defined `animDirection` to `'top2bottom'` or `'bottom2top'`.

* The `animByFrame` property is an integer which indicates at how many frames the animation must change. The higher this number is, the higher the animation is long. Its default value is **12**.

**At this step, your sprite is ready to be used, but you need also to tell the librarie that it should update each state of the sprite.** Please refer to the section below : "Animation update"

3. Images loading
--------------

Now, your images are ready to be loaded with `ImageInGame.loadAll()`. This will browse all added elements and start loading them individually.

A callback function (optional) can be provided as argument. This function will be called when all the elements are loaded :

```javascript
IIG.loadAll(function() {
  // do something ...
});
```

If you do not want to use a callback, you can refer to this property : `IIG.imagesLoaded`. It is `false` by default, and will be set to `true` once all the images are loaded.

4. Animation update
----------------

In order that the images become animated, you must call the `IIG.update()` method within your Game Loop.

Example :

```javascript
function run() {
  // your code ...
  
  IIG.update();
  
  requestAnimationFrame(run);
}
```

5. Drawing images
--------------

Now your images & sprites are ready, the last step is to simply display them within the render loop :

```javascript
function run() {
  // your code ...
  
  IIG.update();

  // Getting the asset by it's name (without the extension)
  var bob = IIG.get('img/bob');
  // Drawing it
  IIG.drawImage(context, bob, 400, 300);
  
  requestAnimationFrame(run);
}
```

If for some reasons you prefer to use the native way, `IIG.get` gives you the access to the image properties :

```javascript
var bob = IIG.get('img/bob');

bob.data; // The image resource
bob.width; // Whole image width
bob.height; // Whole image height
bob.sx; // Current 'x' position of the sprite canvas area
bob.sy; // Current 'y' position of the sprite canvas area
bob.sWidth; // Width of the sprite canvas area
bob.sHeight; // Height of the sprite canvas area
```

Then you'll be able to write yourself something like :

```javascript
context.drawImage(bob.data, bob.sx, bob.sy, bob.sWidth, bob.sHeight, 400, 300, bob.sWidth, bob.sHeight)
```

6. Pausing animation
---------------------

If for some reasons you need to temporarly pause the animation, you can use this sprite property :

```javascript
var bob = IIG.get('img/bob');

bob.pauseAnimation = true;
```

This purely pauses the animation. If you want to resume, just set back to `false`.

7. Full example
------------------------

You can browse and analyze this complete example to become familiar with the librarie. There is also an simple boilerplate project you can check in `./example-project/`

```html
<canvas id="canvas" width="800" height="600"></canvas>

<script src="ImageInGame.js"></script>
<script>

	var canvas = document.querySelector('canvas'),
		ctx = canvas.getContext('2d');

	// Instanciate IIG
	var IIG = new ImageInGame();

	// Add some images & sprites
	IIG.add('img/bomb.png');
	IIG.add('img/gem.png');
	IIG.add({
		filename :'img/bob.png',
		sWidth : 48,
		sHeight : 64,
		sy : 64,
		animDirection : 'left2right',
		alternate : true
	});

	// Load images and indicate the 'run' as callback
	IIG.loadAll(run);

	// This is our game loop
	function run() {
		ctx.clearRect(0, 0, 800, 600);

		// Updating (principally for sprites)
		IIG.update();

		// Getting our images ...
		var bob = IIG.get('img/bob'),
			gem = IIG.get('img/gem'),
			bomb = IIG.get('img/bomb');

		// ... and draw them
		IIG.drawImage(ctx, bob, 100, 250);
		IIG.drawImage(ctx, gem, 160, 267);
		IIG.drawImage(ctx, bomb, 215, 262);
		IIG.drawImage(ctx, gem, 270, 267); // I can draw 'gem' twice if I want to

		requestAnimationFrame(run);
	}

</script>
```