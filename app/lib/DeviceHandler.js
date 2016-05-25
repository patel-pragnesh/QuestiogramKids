/*
 * Utils
 */
var args = arguments[0] || {};
//---------------- IMPORTS ----------------//
var platino = require('io.platino');
//---------------- INSTANCE AND VAR DECLARATIONS ----------------//
var HIGH = 1;	// Devices with high performance
var LOW = 0;	// Devices with medium/low performance
var MAX_FPS = 60;	// Max fps. Is the fps from which have been designed the original values of the game

var session = {
	fps: 30,
	devicePerformance: LOW,
	textureFilter: platino.OPENGL_NEAREST
};

if (OS_IOS) {
	// Simulator:
	if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1 ){
	 	session.fps = 30;
	 	session.devicePerformance = LOW;
	 	session.textureFilter = platino.OPENGL_NEAREST;
	} else 
	if (Ti.Platform.osname === 'iphone') {
		// iPhone:
	 	if (isIphone4(Ti.Platform.model)) {
	 		session.fps = 30;
	 		session.devicePerformance = LOW;
	 		session.textureFilter = platino.OPENGL_NEAREST;
	 	} else
	 	if (isIphone5(Ti.Platform.model)) {
	 		session.fps = 60;
	 		session.devicePerformance = HIGH;
	 		session.textureFilter = platino.OPENGL_LINEAR;
	 	} else {
	 		session.fps = 60;
	 		session.devicePerformance = HIGH;
	 		session.textureFilter = platino.OPENGL_LINEAR;
	 	};
	} else 
	if (Ti.Platform.osname === 'ipad') {	 	
		// iPad:
 		if (isIpad1(Ti.Platform.model)) {
 			session.fps = 30;
 			session.devicePerformance = LOW;
 			session.textureFilter = platino.OPENGL_NEAREST;
     	} else if (isIpad2(Ti.Platform.model)) {
     		session.fps = 30;
     		session.devicePerformance = HIGH;
     		session.textureFilter = platino.OPENGL_LINEAR;
     	} else {
     		session.fps = 60;
     		session.devicePerformance = HIGH;
     		session.textureFilter = platino.OPENGL_LINEAR;
     	};
	}else{
		// Non contempled devices:
		session.fps = 60;
		session.devicePerformance = HIGH;
		session.textureFilter = platino.OPENGL_LINEAR;
	};
	
} else if (OS_ANDROID) {

	if(Titanium.Platform.processorCount >= 4) {
		session.fps = 60;
		session.devicePerformance = HIGH;
		session.textureFilter = platino.OPENGL_LINEAR;
	} else {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);
		var minor = parseInt(version[1],10);
		if(major >= 5 || (major === 4 && minor >=2)) {
			session.fps = 30;
			session.devicePerformance = HIGH;
			session.textureFilter = platino.OPENGL_LINEAR;
		} else {
			session.fps = 30;
			session.devicePerformance = LOW;
			session.textureFilter = platino.OPENGL_NEAREST;
		}
	}	
}

exports.getFPS = function() {
	return session.fps;
};
exports.getPerformance = function() {
	return session.devicePerformance;
};
exports.getTextureFilter = function() {
	return session.textureFilter;
};
exports.setSpeedWithFps = function(val) {
	return val*(MAX_FPS/session.fps);
}
exports.getTimePerFrame = function(val) {
	return 1000/session.fps;
}
// For angular velocity:
exports.getDeltaTime = function(val) {
	return 1/session.fps;
}
function isIphone4(device) {
	switch(device) {
		case 'iPhone 4':
		case 'iPhone 4s':
		case 'iPhone3,1':
		case 'iPhone3,2':
		case 'iPhone3,3':
		case 'iPhone4,1':
			return true;
		break;
		default:
			return false;
	}
}

function isIphone5(device) {
	switch(device) {
		case 'iPhone 5':
		case 'iPhone 5s':
		case 'iPhone5,1':
		case 'iPhone5,2':
		case 'iPhone5,3':
		case 'iPhone5,4':
		case 'iPhone6,1':
		case 'iPhone6,2':
			return true;
		break;
		default:
			return false;
	}
}

function isIpad1(device) {
	switch(device) {
		case 'iPad1':
		case 'iPad1,1':
		case 'iPad2,5': // Mini iPad
		case 'iPad2,6': // Mini iPad
		case 'iPad2,7': // Mini iPad
			return true;
		break;
		default:
			return false;
	}
}
function isIpad2(device) {
	switch(device) {
		case 'iPad 2':
		case 'iPad2,1':
		case 'iPad4,4': // Mini iPad
		case 'iPad4,5': // Mini iPad
		case 'iPad4,6': // Mini iPad
			return true;
		break;
		default:
			return false;
	}
}

exports.HIGH = HIGH;
exports.LOW = LOW;