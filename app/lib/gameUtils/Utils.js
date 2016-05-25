/*
 * Utils
 */
var args = arguments[0] || {};
//---------------- IMPORTS ----------------//
var platino = require('io.platino');
//var Debug = require('core/Debug');
//---------------- INSTANCE AND VAR DECLARATIONS ----------------//
var iRandom = function(min, max){return Math.floor(Math.random() * ((max + 1) - min) + min);};
var iDoubleRandom = function(min, max){return (Math.random() * (max - min) + min);};

//---------------- METHODS ----------------//
exports.calcDistance = function(obj1,obj2){
	var xs = obj1.x - obj2.x;
	xs*=xs;
	var ys = obj1.y - obj2.y;
	ys*=ys;
	return Math.sqrt( xs + ys );
};
//---------------- LOGIC FUNCTIOS ----------------//
exports.padZeros = function(n, length){
  var  n = (n || '').toString();
  while(n.length < length) n = "0" + n;
  return n;
}

exports.hasDeviceNetworkConnection = function() {
  if (Ti.Network.online) {
    return true;
  } else {
    return false;
  }
}
exports.getDpi = function(){
  return (Ti.Platform.displayCaps.dpi/160);
}
exports.testModeEnabled = function(msg) {
  if (Alloy.CFG.testingEnabled) {
    return true;
  }
}
exports.degToRad = function(deg) {
  return deg * Math.PI / 180;
}

exports.addBasicMethods = function(obj) {

    obj.fadeIn = function () {
      obj.transform(platino.createTransform({
          duration: 100,
          alpha: 1
      }))
    };

    obj.fadeOut = function () {
      obj.transform(platino.createTransform({
          duration: 100,
          alpha: 0
      }))
    };
    
}

exports.iRandom = iRandom;
exports.iDoubleRandom = iDoubleRandom;

