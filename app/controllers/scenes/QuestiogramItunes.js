var args = arguments[0] || {};
var platino = require('io.platino');
var plasticine = require('Plasticine');
var sound = plasticine.Sound;
var game = Alloy.Globals.gameView;
var Consts = require('gameUtils/Constants');
var SoundsLibrary = require('gameUtils/SoundsLibrary');
var QuestionsManager = require('QuestionsManager');
var player = Ti.Media.createAudioPlayer();

if (args.data.feedItunes) {
	Ti.API.info(0);
	QuestionsManager.init({data: args.data});
} else {
	Ti.API.info(1);
	var data = require(args.data);
	QuestionsManager.init({data: data});
}


var SCREEN_H = game.screen.height;
var SCREEN_W = game.screen.width;

var questiogramStyle, background, descriptionArea, icon, resolutionArea;

var session = {
	questionId: 1, 
	soundEnabled: false
}

function loadScene() {

	questiogramStyle = QuestionsManager.style;

	background = $.background.getView().getView();
	background.initWithStyle(questiogramStyle);

	descriptionArea = $.descriptionArea.getView();
	descriptionArea.initWithStyle(questiogramStyle);

	icon = $.questionIcon.getView();
	icon.initWithStyle(questiogramStyle);

	resolutionArea = $.resolutionArea.getView().getView();
	resolutionArea.initWithStyle(questiogramStyle);
	resolutionArea.setEventHandling(resolutionEventHandling);

	setupSprites();
	setupQuestion();

}

function init(){
	$.trigger('ready');
	setTimeout(showQuestion, 2000);
}


function setupSprites(){
    scene = $.sceneProxy.getView();

    game.add(descriptionArea);
    game.add(icon);
    game.add($.closeButton);
}

function setupQuestion() {

	var q = QuestionsManager.getQuestion(session.questionId);

	descriptionArea.setup(q.descriptionArea);
	icon.setup(q.typeQuestion);
	resolutionArea.setup(q.resolutionArea);

	if (q.sound && q.sound.enabled) {
		session.soundEnabled = true;
		player.url = q.sound.fileName;
	} else {
		session.soundEnabled = false;
	}
}

function showQuestion() {

	if (descriptionArea.isHidden) {

		var cb = function() {
			setTimeout(function(){
				resolutionArea.fadeIn();
				descriptionArea.fadeOut();
				icon.resetTimer();
				icon.startTimer();
			}, Consts.TIME_HIDE_DESCRIPTION);
		};

		icon.fadeIn();
		descriptionArea.fadeIn(cb);

	} else {

		descriptionArea.fadeIn();
		icon.fadeIn();
		resolutionArea.fadeIn();
		icon.resetTimer();
		icon.startTimer();
	}

	session.soundEnabled && player.start();
	//SoundsLibrary.hasQuestionSound() && SoundsLibrary.playQuestionSound();
}

function hideQuestion(cb) {
	descriptionArea.fadeOut(cb);
	icon.fadeOut();
	resolutionArea.fadeOut();
	
	session.soundEnabled && player.stop();//SoundsLibrary.hasQuestionSound() && SoundsLibrary.removeQuestionSound();
}

function increaseQuestion() {

	session.questionId++;

	if (QuestionsManager.isValidQuestion(session.questionId)) { 
		replaceQuestion();
	} else {
		alert('The end!');
		return;
	}
}

function replaceQuestion() {	
	
	setTimeout(function(){
		function cb() {
			resolutionArea.clean();
			setTimeout(setupQuestion, Consts.DELAY_SETUP_QUESTION);
			setTimeout(showQuestion, Consts.DELAY_SHOW_QUESTION*3);
		};
		hideQuestion(cb);
	}, Consts.DELAY_HIDE_QUESTION);
	
}

// Receive the actions from resolution area:
function resolutionEventHandling(e) {

	var questionBehavior = QuestionsManager.getQuestion(session.questionId).resolutionArea.behavior;

	if (questionBehavior === Consts.AREA_RESOLUTION_BEHAVIOR_SELECT) {
		icon.stopTimer();
		animateWhileCheckResponse({success: e.success});
	} else
	if (questionBehavior === Consts.AREA_RESOLUTION_BEHAVIOR_JOIN) {
		if (e.cleanResolutionArea) {
			icon.stopTimer();
			icon.decreaseTimer();
			icon.startTimer();
		} else {
			icon.stopTimer();
			animateWhileCheckResponse({success: e.success});
		}
		
	} else 
	if (questionBehavior === Consts.AREA_RESOLUTION_BEHAVIOR_MAP) {
		icon.stopTimer();
		animateWhileCheckResponse({
			success: e.success,
			onComplete: resolutionArea.cleanAnnotations
		});
	}

}

function animateWhileCheckResponse(params) {

	var params = params || {};
	var success = params.success;

	var cbAfterObscure = function() {

		resolutionArea.animatePostValidation(success);

		if (success) {
			if (descriptionArea.behavior === Consts.AREA_DESCRIPTION_FORMAT_GIF) {
				descriptionArea.showCompleteGif();
				setTimeout(increaseQuestion, 2000); //At moment we don´t know when the gif is finished, so we wait 2 segs.
			} else {
				increaseQuestion();
			}
			descriptionArea.isHidden && descriptionArea.fadeIn();

		} else {
			icon.decreaseTimer();
			icon.startTimer();
			params.onComplete && params.onComplete();
		}
	};

	SoundsLibrary.playOnTouchAnswer(success);
	background.darken(cbAfterObscure);
	resolutionArea.animatePreValidation();
};

//we need to proxy the widget scene
$.getScene = function(){
	return $.sceneProxy.getView();
}

function exitScene() {

	$.trigger('closing');

	SoundsLibrary.hasQuestionSound() && SoundsLibrary.removeQuestionSound();

	session.soundEnabled && player.stop();

	background.cleanUp();
	resolutionArea.cleanUp();
	descriptionArea.cleanUp();
	icon.cleanUp();

	disposeSprite(background, scene);
	disposeSprite(resolutionArea, scene);
	game.remove(descriptionArea);
	game.remove(icon);
	game.remove($.closeButton);

	descriptionArea = null;
	icon = null;
	$.closeButton = null;

	player = null;

	setTimeout(function(){
		$.trigger('close');
	}, 500)
	
}

function disposeSprite(sprite, view){
	if(!sprite) return;

	var view = view || scene;

	if (view === scene) {
		view.remove(sprite);
	} else if (view === game) {
		view.removeHUD(sprite);
	}
	sprite.dispose();
	sprite = null;
}







