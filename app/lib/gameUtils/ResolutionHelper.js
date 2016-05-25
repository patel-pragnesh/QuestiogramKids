"use strict";

var Consts = require('/gameUtils/Constants');
var game = Alloy.Globals.gameView;
var plasticine = require('Plasticine');
var SCREEN_H = game.screen.height;
var SCREEN_W = game.screen.width;


exports.enableOnTouchAction = function(obj) {
    obj.hasListeners = true;
    obj.addEventListener('touchstart', obj.onTouch);
    obj.addEventListener('touchmove', obj.onTouch);
    obj.addEventListener('touchend', obj.onTouch);
}

exports.disableOnTouchAction = function(obj) {
    if (!obj.hasListeners) return;
    obj.removeEventListener('touchstart', obj.onTouch);
    obj.removeEventListener('touchmove', obj.onTouch);
    obj.removeEventListener('touchend', obj.onTouch);
}

exports.distributeVisualAnswers = function(answers) {
    if (answers.length === 2) {
        for (var i=0; i < answers.length; i++) { 
            answers[i].moveCenter(
                SCREEN_W*0.25 + SCREEN_W*0.5*i,
                SCREEN_H*0.75
            )
        }
    } else
    if (answers.length === 3) {
        for (var i=0; i < answers.length; i++) { 
            answers[i].moveCenter(
                SCREEN_W*0.33*0.5 + SCREEN_W*0.33*i,
                SCREEN_H*0.75
            )
        }
    } else
    if (answers.length === 4) {
        for (var i=0; i < answers.length; i++) { 
            answers[i].moveCenter(
                SCREEN_W*0.25*0.5 + SCREEN_W*0.25*i,
                SCREEN_H*0.75
            )
            /*
            if (i < 2) {
                answers[i].moveCenter(
                    SCREEN_W*0.25 + SCREEN_W*0.5*i,
                    SCREEN_H*0.25*0.5
                )
            } else {
                answers[i].moveCenter(
                    SCREEN_W*0.25 + SCREEN_W*0.5*(i-2),
                    SCREEN_H*0.75*0.5
                )
            }
            */
        }
    };

    for (var i=0; i < answers.length; i++) { 
        answers[i].scale(0,0);
        answers[i].alpha = 1;
    }
}

exports.distributeTextAnswers = function(answers) {

	var heightResolution = SCREEN_H*0.7;
	var heightAnswer = answers[0].height;
	var totalHeightAnswers = answers.length*heightAnswer;
	var freeMargin = heightResolution - totalHeightAnswers;
	var separation = freeMargin/(answers.length + 1);

    for (var i=0; i < answers.length; i++) { 
        answers[i].moveCenter(
            SCREEN_W*0.5,
            separation + (separation + heightAnswer)*i + heightAnswer*0.5
        )
    }

    for (var i=0; i < answers.length; i++) { 
        answers[i].scale(0,0);
        answers[i].alpha = 1;
    }

}

exports.distributeVisualJoins = function(answers) {

	var heightResolution = SCREEN_H;
	var heightAnswer = answers[0].height;
	var totalHeightAnswers = answers.length*heightAnswer;

    if (answers.length % 2 == 0) {
    	var freeMargin = heightResolution - totalHeightAnswers*0.5;
		var separation = freeMargin/(answers.length*0.5 + 1);

	        for (var i=0; i < answers.length; i++) { 
	        	if (i < answers.length*0.5) {
		            answers[i].moveCenter(
		                SCREEN_W*0.25,
		                separation + (separation + heightAnswer)*i + heightAnswer*0.5
		            )
	            } else {
	            	answers[i].moveCenter(
		                SCREEN_W*0.25*3,
		                separation + (separation + heightAnswer)*(i-answers.length*0.5) + heightAnswer*0.5
		            )
	            }
	        }
 
    } else {    

        for (var i = 0; i < answers.length; i++) {
            
            var answer = answers[i];

            a = 2 * Math.PI * i / answers.length - Math.PI*0.5;

            answer.moveCenter(
                SCREEN_W*0.5 + SCREEN_H*0.30*Math.cos(a),
                SCREEN_H*0.5 +SCREEN_H*0.30*Math.sin(a)
            )
        }
    }

    for (var i=0; i < answers.length; i++) { 
        answers[i].scale(0,0);
        answers[i].alpha = 1;
    }
};

exports.calculateLatLngfromPixels = function(mapview, xPixels, yPixels) {
    var region = mapview.region;
    var heightDegPerPixel = -region.latitudeDelta / mapview.rect.height; 
    var widthDegPerPixel = region.longitudeDelta / mapview.rect.width;
    return {
        lat : (yPixels - mapview.rect.height / 2) * heightDegPerPixel + region.latitude,
        lon : (xPixels - mapview.rect.width / 2) * widthDegPerPixel + region.longitude
    };
};


