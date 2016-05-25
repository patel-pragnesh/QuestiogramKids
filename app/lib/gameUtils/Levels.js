"use strict";

var Consts = require('/gameUtils/Constants');
var plasticine = require('Plasticine');
var gameProgress = plasticine.GameProgress;
var Debug = require('core/Debug');
// Note that this version of iRandom is different to the others used in the game!!
// This makes Math.round instead of parseInt
var iRandom = function(min, max){return Math.round(Math.random() * (max - min) + min);};
var counterSuperNova = 0;
// Arrays of constants grouped by its behavior
var DIFFICULTY_LEVELS = [Consts.EASY, Consts.MEDIUM, Consts.HARD];
var SPACE_BEHAVIORS = [Consts.METEORITES, Consts.TRAFFIC, Consts.TRASH];
var BONUSES = [Consts.SUPERNOVA, Consts.COIN/*, Consts.SHIELD, Consts.MAGNET, Consts.TRAJECTORY, Consts.COIN*/];

var MINIMUM_LEVEL_FOR_SPACE_OBJECTS = 8;
var LEVEL_JUMPS_IS_MEDIUM = 5;
var LEVEL_JUMPS_IS_HARD = 10;
var LEVEL_SCENE_IS_MEDIUM = 20;
var LEVEL_SCENE_IS_HARD = 30;
var MINIMUM_LEVEL_SUPERNOVA_MAY_APPEAR = 5;
var CONSECUTIVE_LEVELS_WITHOUT_SUPERNOVA = 5; // At moment not used
var PROBABILITY_SUPERNOVA = 0.3;


// Probability of each bonus/virtual good to appear depending on the level.
// Adjust here the probability that they appear depending on the level
BONUSES.getProbabilityOf = function(bonus, level) {
	if (bonus === Consts.COIN) {
		return 1;
	} else 

	if (bonus === Consts.SUPERNOVA) {		
		// When star appears, counter = CONSECUTIVE_LEVELS_WITHOUT_SUPERNOVA. 
		// By this way we avoid supernova be present twice in less than 5 consecutive screens:
		if (counterSuperNova > 0) {
			counterSuperNova--;
			return 0;
		} else {
			// The supernova won´t appear in first 5 levels. 
			var prob = (level<MINIMUM_LEVEL_SUPERNOVA_MAY_APPEAR) ? 0 : PROBABILITY_SUPERNOVA;
			return prob;
		}
		
	} else 

	if (bonus === Consts.SHIELD) {
		return 0.5;
	} else

	if (bonus === Consts.MAGNET) {
		return 0.5;
	} else 
	
	if (bonus === Consts.TRAJECTORY) {
		return 0.5;
	}
};	
// for each level, we define the probability of appearence of each element for each 
// difficulty (easy, medium or hard). An empty array means that an element won't appear
// Planet level:
exports.createPlanetLevel = function(level) {
	return {jump: getDifficultyJump(level)}
};
// Bonus and space object levels:
exports.createSceneLevel = function(level) {
	return {
		spaceObjects: getSpaceObjects(level),
		bonuses: getBonuses(level)
	};
};
// getDifficultyJump defines the level of jump difficulty to apply depending on the level of the game
function getDifficultyJump(level) {
	var difficulty;
	// Reminder difficulty. Not implemented for this version:
	// var maxLevel = gameProgress.getData('maxScore', 0);
	// var level = (maxLevel > level) ? maxLevel : level;

	if (level < LEVEL_JUMPS_IS_MEDIUM) {
		// first 4 levels can only be easy
		difficulty = 0;
	} else if (level < LEVEL_JUMPS_IS_HARD) {
		// From 5 to 10 levels can be easy and medium
		difficulty = DIFFICULTY_LEVELS[iRandom(0, 1)];
	} else {
		difficulty = DIFFICULTY_LEVELS[iRandom(0, DIFFICULTY_LEVELS.length - 1)];
	}
	return difficulty;
};

// getDifficultyScene defines the level of difficulty to apply depending on the level of the game
// This is a generic difficulty that can be applied to spaceobjects and bonuses
function getDifficultyScene(level) {
	var difficulty;
	// Reminder difficulty. Not implemented for this version:
	// var maxLevel = gameProgress.getData('maxScore', 0);
	// var level = (maxLevel > level) ? maxLevel : level;

	if (level < LEVEL_SCENE_IS_MEDIUM) {
		difficulty = 0;
	} else if (level < LEVEL_SCENE_IS_HARD) {
		difficulty = DIFFICULTY_LEVELS[iRandom(0, 1)];
	} else {
		difficulty = DIFFICULTY_LEVELS[iRandom(0, DIFFICULTY_LEVELS.length - 1)];
	}
	return difficulty;
};

// getSpaceObjects returns an array of space objects that must be used in the level
// This implementation returns an array with only one object or none
// but we return an array to make it easy to add more than one space object in the future
// if we decide to
function getSpaceObjects(level) {

	//First calculate the probability to have any difficulty
	var any = false;
	var spaceObjects = [];
	
	// levels lower than const value are clean
	if (level >= MINIMUM_LEVEL_FOR_SPACE_OBJECTS) {
		// TODO: Set here the formula to determine if a level has any space object
		var chanceToAny = level / 10;
		// we always leave a 10% of probabilities that the level is free of space objects, so there's some time to relax
		chanceToAny = chanceToAny > 0.9 ? 0.9: chanceToAny;

		// If the random is lower or equal to the chances to have any object, then one will exists
		any = Math.random() <= chanceToAny;
	}

	// If any spaceObject should exist, select which one
	// Set to TRUE if wanna test always some space object
	if (any) {
		if (level < 15) {
			spaceObjects.push({
				type: SPACE_BEHAVIORS[Consts.METEORITES],
				difficulty: getDifficultyScene(level)
			});
		} else {
			spaceObjects.push({
				type: SPACE_BEHAVIORS[iRandom(0, SPACE_BEHAVIORS.length - 1)],
				difficulty: getDifficultyScene(level)
			});
		}
	}
	
	return spaceObjects;
}

// getBonuses returns an array of bonuses (supernova, shield and so on) to add to the level
// it can be an array of 0 to n elements
function getBonuses(level) {
	var bonuses = [];
	var rnd;

	for (var i = 0, j = BONUSES.length; i < j; i++) {
		rnd = Math.random();
		if (rnd <= BONUSES.getProbabilityOf(BONUSES[i], level)) {
			if(BONUSES[i] === Consts.SUPERNOVA){
				counterSuperNova = CONSECUTIVE_LEVELS_WITHOUT_SUPERNOVA;
			};
			bonuses.push({
				type: BONUSES[i],
				difficulty: getDifficultyScene(level)
			});
		}
	}

	return bonuses;
}

