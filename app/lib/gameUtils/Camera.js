/*
 * Camera
 */
var args = arguments[0] || {};
var platino = require('io.platino');
var plasticine = require('Plasticine');
var Debug = require('core/Debug');
var game = plasticine.gameView;
var SCREEN_H = plasticine.gameView.screen.height;
var SCREEN_W = plasticine.gameView.screen.width;

var Camera = platino.createTransform();

function init(params) {
	Camera.speed = params.speed || 500;	
	Camera.callback = params.onComplete;
	Camera.addEventListener('complete',function(e) {
		if(!Camera.skipOnComplete) {
			Camera.callback && Camera.callback(e);
		};
	});
}
// Set camera position without movement
function setPos(params) {
	var params = params || {};
	Camera.duration = 0;
	Camera.easing = platino.ANIMATION_CURVE_LINEAR;
	Camera.lookAt_eyeX = params.eyeX || params.centerX;
	Camera.lookAt_centerX = params.centerX;
	Camera.lookAt_eyeY = params.eyeY || params.centerY;
	Camera.lookAt_centerY = params.centerY;
	Camera.lookAt_eyeZ = params.eyeZ;
	Camera.skipOnComplete = params.skipOnCompleteListener || false;
	game.moveCamera(Camera);
}

// Set camera position without movement
function stopMovement(params) {
	var params = params || {};
	Camera.duration = 1000;
	Camera.easing = platino.ANIMATION_CURVE_EASE_OUT;
	Camera.lookAt_eyeX = Camera.lookAt_eyeX;
	Camera.lookAt_centerX = Camera.lookAt_centerX;
	Camera.lookAt_eyeY = Camera.lookAt_centerY - 100;
	Camera.lookAt_centerY = Camera.lookAt_centerY - 100;
	Camera.skipOnComplete = true;
	game.moveCamera(Camera);
}

function moveTo(params) {
	var params = params || {};
	Camera.duration = params.duration || 500;
	Camera.lookAt_centerX = params.centerX || SCREEN_W*0.5;
	Camera.lookAt_centerY = params.centerY || SCREEN_H*0.5; 
	if(params.perspective) {
		Camera.lookAt_eyeX = params.eyeX || SCREEN_W*0.5; 
		Camera.lookAt_eyeY = params.eyeY || SCREEN_H*0.5; 
	} else {
		Camera.lookAt_eyeX = Camera.lookAt_centerX;
		Camera.lookAt_eyeY = Camera.lookAt_centerY;
	}
	Camera.skipOnComplete = params.skipOnCompleteListener || false;
	game.moveCamera(Camera);
};

function moveYTo(params) {
	var params = params || {};
	Camera.duration = params.speed || Camera.speed;
	Camera.lookAt_eyeY = params.centerY; 
	Camera.lookAt_centerY = params.centerY; 
	Camera.skipOnComplete = params.skipOnCompleteListener || false;
	game.moveCamera(Camera);
};

function incrementYTo(params) {
	var params = params || {};
	Camera.duration = params.speed || Camera.speed;
	Camera.lookAt_eyeY += params.centerY; 
	Camera.lookAt_centerY += params.centerY; 
	Camera.skipOnComplete = params.skipOnCompleteListener || false;
	game.moveCamera(Camera);
};

function moveZoomIn(params) {
	var params = params || {};
	Camera.duration = params.duration || 500;
	Camera.delay = params.delay || 0;
	Camera.autoreverse = true;
	Camera.lookAt_centerX = Camera.lookAt_eyeX = params.centerX || SCREEN_W*0.5;
	Camera.lookAt_centerY = Camera.lookAt_eyeY = params.centerY || SCREEN_H*0.5; 
	Camera.lookAt_eyeZ = params.eyeZ || Camera.lookAt_centerX;
	game.moveCamera(Camera);
};

exports.moveZoomOut = function(params) {
	var params = params || {};
	Camera.duration = params.duration || 500;
	Camera.delay = params.delay || 0;
	Camera.autoreverse = true;
	Camera.lookAt_centerX = Camera.lookAt_eyeX = params.centerX || SCREEN_W*0.5;
	Camera.lookAt_centerY = Camera.lookAt_eyeY = params.centerY || SCREEN_H*0.5; 
	Camera.lookAt_eyeZ = params.eyeZ || Camera.lookAt_eyeZ;
	game.moveCamera(Camera);
};

function getOffsetCoord() {
	return {x:Camera.lookAt_centerX, y:Camera.lookAt_centerY};
};

function getCameraYOffset() {
	return Camera.lookAt_centerY;
};

function getCameraYOffsetWithPerspective() {
	return Camera.lookAt_centerY - Camera.perspectiveFactor;
};


exports.init = init;
exports.moveZoomIn = moveZoomIn;
exports.setPos = setPos;
exports.moveTo = moveTo;
exports.moveYTo = moveYTo;
exports.incrementYTo = incrementYTo;
exports.stopMovement = stopMovement;
exports.getOffsetCoord = getOffsetCoord;
exports.getCameraYOffset = getCameraYOffset;
exports.getCameraYOffsetWithPerspective = getCameraYOffsetWithPerspective;
