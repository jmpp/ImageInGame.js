Image In Game (IIG.js)
==============

Image In Game is a simple sprites and images management tool for HTML5 games.

**Summary**

1. [Getting started](#1-getting-started)
2. [Adding files](#2-adding-files)
3. [Loading images](#3-loading-images)
4. [Getting an image instance](#4-getting-an-image-instance)
5. [Attaching an animation to a sprite](#5-attaching-an-animation-to-a-sprite)
  5.1. [Animation parameters](#animation-parameters)
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
var bob = IM.getInstance('img/bob'); // assuming 'img/bob.png' is loaded

bob.animation = new IIG.Animation({
  sWidth : 48,
  sHeight : 64,
  sx : 48,
  sy : 64 * 2,
  animDirection : 'ltr', // by default
  alternate : true,
  animByFrame : 7,
  iterations : 'infinite' // by default
});
```
### Animation parameters

* `sWidth` and `sHeight` corresponds to the width and height of the canvas area which will be displayed. If not specified, they'll be set to 0

* `sx` and `sy` corresponds to the coordinates of the canvas within the image. If not specified, they'll be set to 0

* The `animDirection` property can take 4 values : `'ltr'` (left to right, by default), `'rtl'` (right to left), `'ttb'` (top to bottom) and `'btt'` (bottom to top). It will specify how the canvas will move within the animation.

* The `alternate` property is a boolean which defines if the animation should alternate its direction when over :
  
  ![non alternate](https://raw.github.com/jmpp/ImageInGame.js/master/bob_non_alternate.gif) `alternate : false` (default value)
  
  ![alternate](https://raw.github.com/jmpp/ImageInGame.js/master/bob_alternate.gif) `alternate : true`
  
  Note that if set to `true`, there will be 2 cases :
  
  1. The alternation will be HORIZONTAL if you've previously defined `animDirection` to `'ltr'` or `'rtl'`.
  2. The alternation will be VERTICAL if you've previously defined `animDirection` to `'ttb'` or `'btt'`.

* The `animByFrame` property is an integer which indicates at how many frames the animation must change. The higher this number is, the higher the animation is long. Its default value is **12**.

* The `iterations` property can take `'infinite'` (its default value) or a positive integer which defines how many times the animation will be played before get destroyed. **You can know when it's destroyed by reading the `'animationDestroyed'` parameter on your instance.**
  ```javascript
  if (bob && bob.animationDestroyed) // If the finished animation has been destroyed ...
      bob = IM.killInstance(bob);
  ```

There's two additionnal parameters which allow to control exactly where starts and ends the animation within the spritesheet.

* The `startPoint` parameter defines where the animation start point is.
* The `endPoint` parameter defines where the animation end point is.

![breakpoints](https://raw.github.com/jmpp/ImageInGame.js/master/bob_break_points.png)
```javascript
bob.animation = new IIG.Animation({
  sWidth : 48,
  sHeight : 64,
  animDirection : 'ttb', // want to animate from top to bottom
  startPoint : 64, // 'startPoint' is set at 64 pixels from the offset top of the spritesheet
  endPoint : 64*3, // 'endPoint' is set at 64*3 pixels from the offset top of the spritesheet
});
```

With this, you'll get an animation which will start at 64 pixels and will end at 192 pixels from the offset top of the spritesheet. Of course, if the `animDirection` is set to `'ltr'` or `'rtl'`, the startPoint and endPoint will be from offset left of the sheet.

******************************************

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

bob.animation.pauseAnimation = true; // assuming an animation is attached to this 'bob'
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
    function run(t) {
        ctx.clearRect(0, 0, 800, 600);

        // Updating
        IM.update();

        // ... and draw them (if they're defined)
        if (BOB)	IM.drawImage(ctx, BOB, 100, 250);
        if (GEM)	IM.drawImage(ctx, GEM, 160, 267);
        if (BOMB)	IM.drawImage(ctx, BOMB, 215, 262);
        if (GEM)	IM.drawImage(ctx, GEM, 270, 267); // I can draw 'gem' twice if I want to

        // Delete elements after 5 seconds ...
        if (t > 5000) {
        	BOB = IM.killInstance(BOB);
        	GEM = IM.killInstance(GEM);
        	BOMB = IM.killInstance(BOMB);
        }

        requestAnimationFrame(run);
    }

</script>
```