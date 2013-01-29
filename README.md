Image In Game (IIG.js) [revision 2]
==============

Image In Game is a simple sprites and images management tool for HTML5 games.

**Summary**

1. [Getting started](#1-getting-started)
2. [Adding files](#2-adding-files)
3. [Loading images](#3-loading-images)
4. [Getting an image instance](#4-getting-an-image-instance)
5. [Attaching an animation to a sprite](#5-attaching-an-animation-to-a-sprite)
6. [Animation update](#6-animation-update)
7. [Drawing images](#7-drawing-images)
8. [Pausing animation](#8-pausing-animation)
9. [Destroy an instance](#9-destroy-an-instance)
10. [FULL EXAMPLE](#full-example)

1. Getting started
---------------

In order to get started, include `IIG.min.js` in your document and create a new manager :

```javascript
var IM = new IIG.ImageManager();
```

2. Adding files
---------------------

With the Manager, you can add one or several files at once depending on your needs :

```javascript
IM.add('img/player.png');
IM.add('img/wall.png');
// OR ...
IM.add('img/player.png', 'img/wall.png' /*...*/ );
```

3. Loading images
--------------

Before using your images or bind them to an animation, you'll have to load them with `IIG.ImageManager.loadAll()`

(An optional callback function can be provided as argument. This function will be called when all the elements are loaded)

```javascript
IIG.loadAll(function() {
  // do something ...
});
```

If you do not want to use a callback, you can refer to this property : `IIG.ImageManager.imagesLoaded`. It is `false` by default, and will be set to `true` once all the images are loaded.

4. Getting an image instance
--------------

Once your images are loaded, then you can get an instance of each one by using `IIG.ImageManager.getInstance()`

```javascript
var player = IM.getInstance('img/player'); // Getting the asset by its name (without the extension)

// var 'player' is an object :
player.data; // image resource which can be drawn with context.drawImage()
player.width; // image width
player.height; // image height
player.animation; // animation attached to the image if necessary (null by default)
```

5. Attaching an animation to a sprite
--------------

An animation is something which must be binded to the `animation` property of an image instance.

First, let's consider this sprite representing a Bob guy :

![bob](https://raw.github.com/jmpp/ImageInGame.js/master/bob.png) (C) by ([hexapode](https://github.com/hexapode))

Each state of Bob is in a canvas of 48 x 64 pixels. We'll start with the "down" state of Bob and with the middle canvas :

![bob measures](https://raw.github.com/jmpp/ImageInGame.js/master/bob_measures.png)

Knowing these informations, you will create an animation by this way :

```javascript
var bob = IM.getInstance('img/bob'); // considering that 'img/bob.png' is loaded

bob.animation = new IIG.Animation({
  sWidth : 48,
  sHeight : 64,
  sx : 48,
  sy : 64 * 2,
  animDirection : 'left2right',
  alternate : true,
  animByFrame : 7
});
```

* `sWidth` and `sHeight` corresponds to the width and height of the canvas area which will be displayed. If not specified, they'll be set to 0

* `sx` and `sy` corresponds to the coordinates of the canvas within the image. If not specified, they'll be set to 0

* The `animDirection` property can take 4 values : `'left2right'` (by default), `'right2left'`, `'top2bottom'` and `'bottom2top'`. It will specify how the canvas will move within the animation.

* The `alternate` property is a boolean which defines if the animation should alternate its direction when over :
  
  ![non alternate](https://raw.github.com/jmpp/ImageInGame.js/master/bob_non_alternate.gif) `alternate : false` (default value)
  
  ![alternate](https://raw.github.com/jmpp/ImageInGame.js/master/bob_alternate.gif) `alternate : true`
  
  Note that if set to `true`, there will be 2 cases :
  
  1. The alternation will be HORIZONTAL if you've previously defined `animDirection` to `'left2right'` or `'right2left'`.
  2. The alternation will be VERTICAL if you've previously defined `animDirection` to `'top2bottom'` or `'bottom2top'`.

* The `animByFrame` property is an integer which indicates at how many frames the animation must change. The higher this number is, the higher the animation is long. Its default value is **12**.

**At this step, your sprite is ready to be used, but you need also to tell the librarie that it should update each state of the sprite.** Please refer to the next section "Animation update"

6. Animation update
----------------

In order that the sprites becomes animated, you must call the `IIG.ImageManager.update()` method within your Game Loop.

Example :

```javascript
function run() {
  // your code ...
  
  IM.update();
  
  requestAnimationFrame(run);
}
```

7. Drawing images
--------------

Now your images & sprites are ready, the last step is to simply display them within the render loop by using the shortcut `IIG.ImageManager.drawImage`

```javascript
function run() {
  // your code ...
  
  IM.update();

  var bob = IM.getInstance('img/bob');
  IM.drawImage(context, bob, 400, 300); // Draws the animated Bob guy at 400x300, using the canvas context
  
  requestAnimationFrame(run);
}
```

If for some reasons you prefer to use the native HTML5 `context.drawImage`, just use the instance properties :

```javascript
var bob = IM.getInstance('img/bob');

context.drawImage(
  bob.data, // image resource
  bob.animation.sx, // current 'x' position of the sprite canvas area
  bob.animation.sy, // current 'y' position of the sprite canvas area
  bob.animation.sWidth, // width of the sprite canvas area
  bob.animation.sHeight, // height of the sprite canvas area
  400,
  300,
  bob.animation.sWidth,
  bob.animation.sHeight
);
```

8. Pausing animation
---------------------

If for some reasons you need to temporarly pause the animation, you can use this sprite property :

```javascript
var bob = IM.getInstance('img/bob');

bob.pauseAnimation = true;
```

This purely pauses the animation. If you want to resume, just set back to `false`.

9. Destroy an instance
----------------------

Sometimes you'll have to destroy an instance of an image you've previously created (e.g. for a killed enemy).

In order not to overload the JS garbage collector, you MUST imperatively destroy an instance this way :

```javascript
var enemy = IM.getInstance('img/enemy');

// ...

// don't need 'enemy' anymore ? then destroy it !
enemy = IM.killInstance(enemy);

enemy; // undefined
```

This is removing everything associated to this image, including its Animation.

FULL EXAMPLE
------------------------

You can browse and analyze this complete example to become familiar with the librarie. There is also an simple boilerplate project you can check in `./example-project/`

```html
<canvas id="canvas" width="800" height="600"></canvas>

<script src="IIG.min.js"></script>
<script>

	var canvas = document.querySelector('canvas'),
		ctx = canvas.getContext('2d');

	// Instanciate a Manager
	var IM = new IIG.ImageManager();

	// Add some images & sprites
	IM.add(
	  'img/bomb.png',
	  'img/gem.png',
	  'img/bob.png'
	);

	// Load images and indicate the 'init' function as callback
	IM.loadAll(init);

	var BOMB, GEM, BOB;
	function init() {

		// getting instances
		BOMB = IM.getInstance('img/bomb');
		GEM = IM.getInstance('img/gem');
		BOB = IM.getInstance('img/bob');

		// binding an animation for the Bob guy
		BOB.animation = new IIG.Animation({
			sWidth : 48,
			sHeight : 64,
			sy : 64,
			alternate : true
		});

		// all is initiated, let's run !
		run();
	}

	// This is our game loop
	function run() {
		ctx.clearRect(0, 0, 800, 600);

		// Updating
		IM.update();

		// ... and draw them
		IM.drawImage(ctx, BOB, 100, 250);
		IM.drawImage(ctx, GEM, 160, 267);
		IM.drawImage(ctx, BOMB, 215, 262);
		IM.drawImage(ctx, GEM, 270, 267); // I can draw 'gem' twice if I want to

		requestAnimationFrame(run);
	}

</script>
```