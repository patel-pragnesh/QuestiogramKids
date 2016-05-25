/*
 * Utils
 */
var args = arguments[0] || {};
//---------------- IMPORTS ----------------//
var platino = require('io.platino');
var utils = require('gameUtils/Utils');
var Debug = require('core/Debug');
var CharacterManager = require('gameUtils/CharacterManager');

//---------------- INSTANCE AND VAR DECLARATIONS ----------------//
var COLOR_SCENES = 0;
var COLOR_BARS = 1;
var currentSceneColor = {};
var indexCurrentSceneColor = 0;
var themes = [];
var session = {
	currentTheme: null,
	indexTheme: 0
}

exports.setStyle = function(style) {
	_.each(style, function (value) {  
		if(value && value.name) {
			
			var theme = {
				name: value.name,
				background: value.background,
				bars:_.toArray(value.bars)
			}
			themes.push(theme);
		}	
	})	
}

exports.changeTheme = function(scn,obj) {
	session.indexTheme = (session.indexTheme >= themes.length -1) ? 0 : session.indexTheme + 1;
}

exports.applyThemeTo = function(params) {
	var params = params || {};

	//var newTheme = themes[indexTheme];
	var character = CharacterManager.getCurrentCharacter();
	session.currentTheme = _.findWhere(themes, {name:character.palette});

	
	//var newTheme = 
	//alert(currentTheme);

	params.background.transform(platino.createTransform({
		duration:500,
		red:session.currentTheme.background[0], 
		green:session.currentTheme.background[1], 
		blue:session.currentTheme.background[2]
	}));

	if (params.objects) {
		for (var i = 0, len = params.objects.length; i < len; i++) {
			var bar = session.currentTheme.bars[i];
			params.objects[i].color(bar[0], bar[1], bar[2])
		}
	}

	return session.currentTheme.name
};

exports.getColorFromTheme = function(params) {
	var params = params || {};
//	var newTheme = themes[session.indexTheme];
	if(params.type === COLOR_SCENES) {
		return session.currentTheme.background;
	} else if (params.type === COLOR_BARS){
		var index = utils.iRandom(0,session.currentTheme.bars.length - 1);
		return session.currentTheme.bars[index];
	}
}

exports.getSceneColor = function() {
	return currentSceneColor;
};

exports.animateColor = function(obj) {
	trColor.parent = obj;
	obj.transform(trColor);
};
/*
 * getNextColor
 * return a dict with the next color to current scene color
 */
exports.getNextColor = function(obj) {
	var nextColor;
	if(indexCurrentSceneColor < sceneColors.length -1) {
		nextColor = indexCurrentSceneColor + 1;
	} else {
		nextColor = 0;
	}
	return sceneColors[nextColor];
};

exports.COLOR_BARS = COLOR_BARS;
exports.COLOR_SCENES = COLOR_SCENES;


