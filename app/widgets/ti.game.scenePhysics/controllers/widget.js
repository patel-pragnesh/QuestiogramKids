
var args = arguments[0] || {};

/**
 * The physicsScene widget is a platino scene using chipmunk module.
 * Use the add method to addn array of sprites. The good news is that
 * I added support for some typical sprite types used in 2D games, such as:
 *  - rogue or kinematic: a body not affected by physics (just a sprite)
 *  - static: a body without movement (optimized to not move). It is affected by physics and collisions, but does not move
 *  - dynamic: full physics features working (sprite+moment+body+shape)
 *  - sensor: fires the collision event, but there's not physic collision
 **/

Ti.API.info('ti.game.sceneBox2D');


require('co.lanica.chipmunk2d');
var platino = require('io.platino');
var ALmixer = platino.require('co.lanica.almixer');
var chipmunk = co_lanica_chipmunk2d;
var v = chipmunk.cpv;
var DebugDraw = require("co.lanica.chipmunk2d.debugdraw");

//Local-to-module vars
var scene = $.scene;

// constants
var TICKS_PER_SECOND = 180.0; // recommended between 60 and 240; higher = more accuracy (but higher CPU load)

// forward declarations
var space = null;		//space is created when the scene is activated
var data = null;
var pSprites = null;
var pMoments = null;
var pBodies = null;
var pShapes = null;

var pConstraint1 = [];
var pConstraint2 = [];
var pConstraint3 = [];
var _accumulator = 0.0;

var collisionHandler;
var callbackCollisions = {};

var game = Alloy.Globals.gameView;

if(!game) Ti.API.error('ti.game.sceneBox2D error: game not defined. Pass gameview as argument to the scene');


/**
* Receives a sprite or an array of sprites and adds them to the scene
* If the sprite contains any of the properties body, moment or shape, these elements
* are also created and added to the chipmunk world
*/

$.add = function(sprites){
	var sprites = sprites || [];
	var i, j, sprite, width, height, mass, moment, body, shape, radius, center, shapeType;

	if(!space){
		Ti.API.error('ti.game.sceneBox2D error: sceneBox2d.add(sprites) called but space is not initialized yet.');
	}

	//if it is not an array, is because is just a sprite. Convert it to array containing it
	if(!sprites instanceof Array) sprites = [].push(sprites);

	//Ti.API.info('ti.game.sceneBox2d.add(): adding ' + sprites.length + ' sprites');

	$.scene.beginSpriteAdd();
	$.scene.beginSpriteSort();

	var spriteType = '';

	for (var i = sprites.length - 1; i >= 0; i-- ){

		sprite = sprites[i];

		// In case we are receiving xml children empty tags.
		// This may seems absurd, but is a workaround for
		// fix: https://jira.appcelerator.org/browse/TC-3583
		if (!sprite) {
			continue;
		}
		
		scene.add(sprite);
		//Ti.API.info("sprite props: " + JSON.stringify(sprite))
		
		// types could be: 
		// rogue: a body not affected by gravity (just a sprite)
		// static: a body without movement (optimized to not move). It is affected by physics and collisions, but does not move
		//         use cpBodyNewStatic() to create it
		// dynamic: full physics features working (sprite+moment+body+shape)
		// sensor: fires the collision event, but there are not physic collision

		//a way to avoid gravity is to set a force negative like m_body.force = cpvmult( SPACE.gravity, -m_body.mass );

		spriteType = sprite.type;

		//rogue sprites does not have any physics emulation. 
		if(!spriteType || spriteType === 'rogue') continue;

		if(!exists(sprite.shape)){
			Ti.API.error('ti.game.scenePhysics.add(): every non-rogue sprite must define shape property');
			continue;
		}

		if(sprite.shape.type === 'circle'){
			shapeType = 'circle';
			//if no radius/center declared, try to guess it
			radius = sprite.shape.radius || sprite.width / 2;
		}else{
			shapeType = 'box';
		}
		
		center = sprite.center || {x: sprite.width / 2, y: sprite.height / 2};

		var shapeWidth = sprite.shape.width || sprite.width;
		var shapeHeight = sprite.shape.height || sprite.height;

		if(spriteType === 'static' || spriteType === 'sensor'){
			// create a static body without moment nor mass
			body = chipmunk.cpBodyNewStatic();
			chipmunk.cpBodySetPos(body, v(center.x, cpY(center.y)));
			
		}else if(spriteType === 'dynamic'){
			// create a moment of inertia to use for body creation
			mass = sprite.mass || 1;
			if(shapeType === 'circle') moment = chipmunk.cpMomentForCircle(mass, 0, radius, v(0, 0));
			else if(shapeType === 'box') moment = chipmunk.cpMomentForBox(mass, shapeWidth, shapeHeight);

			pMoments.push(moment);
			
			// create a body
			body = chipmunk.cpBodyNew(mass, moment); //replace moment by Infinity to have real solid objects
			chipmunk.cpSpaceAddBody(space, body);
			chipmunk.cpBodySetPos(body, v(center.x, cpY(center.y)));

			if(exists(sprite.angle) && sprite.angle > 0)		chipmunk.cpSetAngle(body, sprite.angle);
			if(exists(sprite.angleVel))		chipmunk.cpSetAngleVel(body, sprite.angleVel);
			if(exists(sprite.angVelLimit))	chipmunk.cpBodySetAngVelLimit(body, sprite.angVelLimit);
			if(exists(sprite.vel))			chipmunk.cpBodySetVel(body, sprite.vel);
			if(exists(sprite.velLimit))		chipmunk.cpBodySetVelLimit(body, sprite.velLimit);
			if(exists(sprite.force))		chipmunk.cpBodySetForce(body, sprite.force);
			if(exists(sprite.torque))		chipmunk.cpBodySetTorque(body, sprite.torque);
			
		}

		// create a shape
		if(shapeType === 'circle') 
			shape = chipmunk.cpCircleShapeNew(body, radius, v(0, 0));
		else if(shapeType === 'box')
			shape = chipmunk.cpBoxShapeNew(body, shapeWidth, shapeHeight);

		chipmunk.cpSpaceAddShape(space, shape);
		
		if(spriteType === 'sensor') shape.sensor = 1;

		chipmunk.cpShapeSetElasticity(shape, sprite.elasticity);
		chipmunk.cpShapeSetFriction(shape, sprite.friction);

		shape.tag = body.tag = sprite.tag;
		
		// store references for sprite, moment, body, and shape
		sprite.bodyIndex = pBodies.length;
		pBodies.push(body);
		pShapes.push(shape);
		pSprites.push(sprite);

	}

	if (debugDraw && debugDraw.active) {
		debugDraw.addBodies(pBodies);
	}
	
	$.scene.commitSpriteAdd();
	$.scene.commitSpriteSort();

}

$.addShape = function(params){
	if(!space) return;

	if(params.type === 'rect'){
		var v0 = v(params.v0.x, params.v0.y);
		var v1 = v(params.v1.x, params.v1.y);
		//params: cpSegmentShapeNew(cpBody * body, cpVect a, cpVect b, cpFloat radius)
		var shape = chipmunk.cpSegmentShapeNew(space.staticBody, v0, v1, 0);
		shape.tag = params.tag || '';

	}else if(params.type === 'circle'){
		//params: cpCircleShapeNew(cpBody * body, cpFloat radius, cpVect offset)
		var shape = chipmunk.cpCircleShapeNew(space.staticBody, params.radius, params.v0);
		shape.type = 'circle';
		shape.tag = params.tag || '';

	}else{
		Ti.API.warn('ti.game.scenePhysics.addShape() Shape type not defined. Shape not created.');
		return;
	}

	chipmunk.cpShapeSetElasticity(shape, params.elasticity);
	chipmunk.cpShapeSetFriction(shape,  params.friction);
	chipmunk.cpSpaceAddShape(space, shape);
	pShapes.push(shape);
};

//Moves a proxy with body in the scene and syncs its center
//@param params.sprite sprite with physics
//@params x 
//@params y
$.move = function(params){
	
	var sprite = params.sprite;
	Ti.API.info('ti.game.scenePhysics.move() bodyIndex ' + sprite.bodyIndex);
	var body = pBodies[sprite.bodyIndex];
	var newX = params.x,
		newY = params.y;

	chipmunk.cpBodySetPos(body, v(newX, newY));
	
	sprite.center = {x: newX, y: newY};
	//sprite.x = newX;
	//sprite.y = newY;
};

// Collision handler function types. While all of them take an arbiter, space, and a user data pointer
// only the begin() and preSolve() callbacks return a value. 
// for more information: https://chipmunk-physics.net/release/ChipmunkLatest-Docs/
$.addCollisionHandler = function(params){

	var params = params || {};

	var beginFunc, preSolveFunc, postSolveFunc, separateFunc;

	if (params.onStart) {
		callbackCollisions.onStart = params.onStart;
		beginFunc = begin;
	} else {
		beginFunc = null;
	}

	if (params.onPreSolve) {
		callbackCollisions.onPreSolve = params.onPreSolve;
		preSolveFunc = preSolve;
	} else {
		preSolveFunc = null;
	}

	if (params.onPostSolve) {
		callbackCollisions.onPostSolve = params.onPostSolve;
		postSolveFunc = postSolve;
	} else {
		postSolveFunc = null;
	}

	if (params.onSeparate) {
		callbackCollisions.onSeparate = params.onSeparate;
		separateFunc = separate;
	} else {
		separateFunc = null;
	}

	collisionHandler = new chipmunk.cpSpaceAddCollisionHandlerContainer();
	chipmunk.cpSpaceAddCollisionHandler(space, 0, 0, beginFunc, preSolveFunc, postSolveFunc, separateFunc, collisionHandler);

}

// DebugDraw options: 
// 
// BB = draw bounding box
// Circle = draw circle shape
// Vertex = draw polygon vertex
// Poly = draw polygon shape
// Constraint = draw constraint anchor
// ConstraintConnection = draw constraint connection between bodies
//
// Methods:
// DebugDraw.addBody(body)
// DebugDraw.removeBody(body)
// DebugDraw.addBodies(arrayOfBodies)
// DebugDraw.removeBodies(arrayOfBodies)
//
var debugDraw = new DebugDraw(platino, chipmunk, game, scene, {
	BB:false, Circle:true, Vertex:false, Poly:true, Constraint:true, ConstraintConnection:true
});
debugDraw.active = false;

// chipmunk y-coordinates are reverse value of platino's, so use the following
// function to convert chipmunk y-coordinate values to platino y-coordinates and vice versa
var cpY = function(y) {
	return (Alloy.CFG.screenHeight - y);
};
$.cpY = cpY;

// convert chipmunk angle (radians) to platino angles (degrees)
var cpAngle = function(angle) {
	return -(angle) * (180/Math.PI);
};

// get a random number between min and max (not related to chipmunk directly)
var getRandomInRange = function(min, max) {
	return Math.random() * (max - min) + min;
};

// returns sprites associated with arbiter
// an arbiter is a chipmunk struct that holds information about two bodies that have collided
var getSpritesFromArbiter = function(arbiter) {
	var bodies, sprites, i;
	
	bodies = [];
	sprites = [];
	chipmunk.cpArbiterGetBodies(arbiter, bodies);
	
	for (i = pBodies.length-1; i >= 0; i--) {
		// Notice how we use .equals method instead of JavaScript equality operator? (===)
		// Physics bodies must be compared using equals method.
		if ((pBodies[i].equals(pBodies[0])) || (pBodies[i].equals(pBodies[1]))) {
			sprites.unshift(pSprites[i]);
		}
		
		if (sprites.length >= 2) {
			break;
		}
	}
	if (sprites.length >= 2) {
		return {
			a: sprites[0],
			b: sprites[1]
		};
	}
};

// [begin] phase collision callback
var begin = function(arbiter, space) {		
	var sprites = getSpritesFromArbiter(arbiter);
	
	if (sprites) {
		Ti.API.info("[begin] collision for " + sprites.a.tag + ' with ' + sprites.b.tag);

		callbackCollisions.onStart && callbackCollisions.onStart(sprites);

	}
	return true;
};

// [preSolve] phase collision callback
var preSolve = function(arbiter, space) {
    var sprites = getSpritesFromArbiter(arbiter);
	
	if (sprites) {
		Ti.API.info("[preSolve] collision for " + sprites.a.tag + ' with ' + sprites.b.tag);
		callbackCollisions.onPreSolve && callbackCollisions.onPreSolve();
	}
	return true;
};

// [postSolve] phase collision callback
var postSolve = function(arbiter, space) {
    var sprites = getSpritesFromArbiter(arbiter);
	
	if (sprites) {
		Ti.API.info("[postSolve] collision for " + sprites.a.tag + ' with ' + sprites.b.tag);
		callbackCollisions.onPostSolve && callbackCollisions.onPostSolve();
	}
};

// [separate] phase collision callback (bodies have separated)
var separate = function(arbiter, space) {
    
    var sprites = getSpritesFromArbiter(arbiter);
	
	if (sprites) {
		Ti.API.info("[separate] collision for " + sprites.a.tag + ' with ' + sprites.b.tag);
		callbackCollisions.onSeparate && callbackCollisions.onSeparate();
	}
};


// Polls the position and angle of all physics bodies, and adjusts the
// properties of the corresponding sprite to match
var syncSpritesWithPhysics = function() {
	var i, pos, angle;
	
	for (i = 0; i < pSprites.length; i++) {
		if (!chipmunk.cpBodyIsSleeping(pBodies[i])) {
			pos = chipmunk.cpBodyGetPos(pBodies[i]);
			angle = cpAngle(chipmunk.cpBodyGetAngle(pBodies[i]));
			
			pSprites[i].x = pos.x - (pSprites[i].width * 0.5);
			pSprites[i].y = cpY(pos.y) - (pSprites[i].height * 0.5);
			pSprites[i].angle = angle;
		}
	}

	if (debugDraw && (debugDraw.active)) {
		debugDraw.update();
	}

};

var stepPhysics = function(delta) {
	var dt = delta/1000.0;
    var fixed_dt = 1.0/TICKS_PER_SECOND;

    // add the current dynamic timestep to the accumulator
    _accumulator += dt;

    while(_accumulator > fixed_dt) {
    	chipmunk.cpSpaceStep(space, fixed_dt);
    	_accumulator -= fixed_dt;
    }
};

// game loop (enterframe listener)
var update = function(e) {
    stepPhysics(e.delta);
	syncSpritesWithPhysics();
};

// touch listener for the screen (turn debug draw on)
var onScreenTouch = function() {
	//debugDraw.active = true;
};

function exists(obj){
	return typeof obj !== "undefined";
}

function onSceneActivated(e){
	Ti.API.info('scene activated');


	$.scene.removeEventListener('activated', onSceneActivated);

	//WTools.setTiProps(args, $.view);

	// Create chipmunk space
	space = chipmunk.cpSpaceNew();
	//data = new chipmunk.cpSpaceAddCollisionHandlerContainer();
	//chipmunk.cpSpaceAddCollisionHandler(space, 0, 0, begin, preSolve, postSolve, separate, data);
	
	//Ti.API.info(JSON.stringify(args));

	if(exists(args.gravity)) 			chipmunk.cpSpaceSetGravity(space, v(args.gravity.x, args.gravity.y));
	if(exists(args.sleepTimeThreshold))	chipmunk.cpSpaceSetSleepTimeThreshold(space, args.sleepTimeThreshold);//Speed threshold for a body to be considered idle. The default value of 0 means to let the space guess a good threshold based on gravity.
	if(exists(args.collisionSlop))		chipmunk.cpSpaceSetCollisionSlop(space, args.collisionSlop);//Amount of overlap between shapes that is allowed. It’s encouraged to set this as high as you can without noticable overlapping as it improves the stability. It defaults to 0.1.
	if(exists(args.iterations))			chipmunk.cpSpaceSetIterations(space, args.iterations);	//Iterations allow you to control the accuracy of the solver. Defaults to 10
	if(exists(args.damping))		 	chipmunk.cpSpaceSetDamping(space, args.damping);	//Amount of simple damping to apply to the space. A value of 0.9 means that each body will lose 10% of it’s velocity per second. Defaults to 1.


	// holds references to all physics-enabled sprites
	pSprites = [];
	
	// The following arrays will hold references to moments, bodies, and shapes for two reasons:
	// a) so they are not garbage collected before you're ready to use them
	// b) so you can sync sprite properties with bodies in your game loop (e.g. enterframe)
	pMoments = [];
	pBodies = [];
	pShapes = [];	

	if (debugDraw && debugDraw.active) {
		debugDraw.addBodies(pBodies);
	}
	
	if(args.children) $.add(args.children);
	
	// wait 3 seconds after the scene loads and start the game loop
	setTimeout(function() {
		game.addEventListener('enterframe', update);
		game.addEventListener('touchstart', onScreenTouch);
	}, 1000);

	$.trigger('activated', e);
	//WTools.cleanArgs(args);
}

$.cleanPhysicsFromMemory = function() {

	game.removeEventListener('enterframe', update);
	game.removeEventListener('touchstart', onScreenTouch);

	for (var i = pSprites.length - 1; i >= 0; i-- ){
		pSprites[i].dispose();
		pSprites[i] = null;
	}

	pSprites.length = 0;

	for (var i = pShapes.length - 1; i >= 0; i-- ){
		chipmunk.cpSpaceRemoveShape(space, pShapes[i]);
		chipmunk.cpShapeFree(pShapes[i]);
		pShapes[i] = null;
	}

	pShapes.length = 0;

	for (var i = pBodies.length - 1; i >= 0; i-- ){		
		chipmunk.cpSpaceRemoveBody(space, pBodies[i]);
		chipmunk.cpBodyFree(pBodies[i]);
		pBodies[i] = null;
	}

	pBodies.length = 0;

	for (var i = pMoments.length - 1; i >= 0; i-- ){
		pMoments[i] = null;
	}
	pMoments.length = 0;
	
	chipmunk.cpSpaceFree(space);
	space = null;

	scene.dispose();

}
// scene 'deactivated' event listener function (scene exit-point)
var onSceneDeactivated = function(e) {
	alert('scene deactivated');
	game.removeEventListener('enterframe', update);
	game.removeEventListener('touchstart', onScreenTouch);

	
	scene.dispose();
};

scene.addEventListener('activated', onSceneActivated);
scene.addEventListener('deactivated', onSceneDeactivated);



