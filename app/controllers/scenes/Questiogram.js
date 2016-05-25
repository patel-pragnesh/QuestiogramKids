var args = arguments[0] || {};
var platino = require('io.platino');
var plasticine = require('Plasticine');
var sound = plasticine.Sound;
var game = Alloy.Globals.gameView;
var Consts = require('gameUtils/Constants');
var SoundsLibrary = require('gameUtils/SoundsLibrary');
var QuestionsManager = require('QuestionsManager');
var data = require('dataQuestiograms/kids');
QuestionsManager.init({data: data});

var SCREEN_H = game.screen.height;
var SCREEN_W = game.screen.width;

var questiogramStyle, background, descriptionArea, icon, resolutionArea, mainItem;

var session = {
	questionId: 1,
	hasTextIntro: false
}

function loadScene() {
	questiogramStyle = QuestionsManager.style;

	background = $.background.getView().getView();
	background.initWithStyle(questiogramStyle);

	descriptionArea = $.descriptionArea.getView();
	descriptionArea.initWithStyle(questiogramStyle);

	mainItem = $.mainItem.getView().getView();
	mainItem.initWithStyle(questiogramStyle);

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
	!session.hasTextIntro && setTimeout(showQuestion, 1000);
}


function setupSprites(){
    scene = $.sceneProxy.getView();

    game.add(descriptionArea);
    game.add(icon);
    game.add($.closeButton);
    game.add($.textIntroLbl);
}

function setupQuestion() {

	var q = QuestionsManager.getQuestion(session.questionId);

	descriptionArea.setup(q.descriptionArea);
	icon.setup(q.typeQuestion);
	resolutionArea.setup(q.resolutionArea);
	mainItem.setup(q.mainItem);

	q.questionBackground && q.questionBackground.enabled && background.setQuestionBackground(q.questionBackground);

	if (q.sound && q.sound.enabled) {
		SoundsLibrary.loadQuestionSound(questiogramStyle.assetsPath+q.sound.fileName);
	}

	q.textIntro && q.textIntro.enabled && setTextIntro(q.textIntro.texts);
}

function setTextIntro(texts) {
	$.textIntroLbl.texts = texts;
	$.textIntroLbl.indexText = 0;
	session.hasTextIntro = true;
	$.textIntroLbl.addEventListener('click', passTextIntro);
	$.textIntroLbl.text = texts[0];
}

function showQuestion() {

	if (session.hasTextIntro) return;

	background.showQuestionBackground();

	if (descriptionArea.isHidden) {

		var cb = function() {
			setTimeout(function(){
				resolutionArea.fadeIn();
				descriptionArea.fadeOut();
				mainItem.fadeOut();
				icon.resetTimer();
				icon.startTimer();
			}, Consts.TIME_HIDE_DESCRIPTION);
		};

		icon.fadeIn();
		descriptionArea.fadeIn(cb);
		mainItem.fadeIn();
		mainItem.isHiddenByBox() && background.showBoxShadow();

	} else {

		descriptionArea.fadeIn();
		icon.fadeIn();
		mainItem.fadeIn();
		mainItem.isHiddenByBox() && background.showBoxShadow();
		resolutionArea.fadeIn();
		icon.resetTimer();
		icon.startTimer();
	}

	SoundsLibrary.hasQuestionSound() && SoundsLibrary.playQuestionSound();
}

function hideQuestion(cb) {
	descriptionArea.fadeOut();
	icon.fadeOut();
	resolutionArea.fadeOut();
	background.hideQuestionBackground();
	mainItem.fadeOut(cb);
	SoundsLibrary.hasQuestionSound() && SoundsLibrary.removeQuestionSound();
}

function increaseQuestion() {

	session.questionId++;

	if (QuestionsManager.isValidQuestion(session.questionId)) { 
		replaceQuestion();
	} else {
		alert('Muchas gracias por jugar!!');
		return;
	}
}

function replaceQuestion() {	

	setTimeout(function(){
		function cb() {
			background.animateForward();
			setTimeout(resolutionArea.clean, 100);
			setTimeout(setupQuestion, Consts.DELAY_SETUP_QUESTION);
			setTimeout(showQuestion, Consts.DELAY_SHOW_QUESTION);
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
	} else
	if (questionBehavior === Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT) {

		animateWhileCheckResponse({
			success: e.success
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
			} else
			if (mainItem.coverType === Consts.MAIN_ITEM_COVER_BOX) {
				background.showParticles();
				mainItem.throwBoxEnigma();
				background.hideBoxShadow();
				setTimeout(increaseQuestion, 1000);
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

function passTextIntro(e) {

	$.textIntroLbl.indexText++;
	var indexText = $.textIntroLbl.indexText;

	if (indexText > $.textIntroLbl.texts.length-1) {
		$.textIntroLbl.text = '';
		$.textIntroLbl.removeEventListener('click', passTextIntro);
		session.hasTextIntro = false;
		showQuestion();
	} else {
		$.textIntroLbl.text = $.textIntroLbl.texts[indexText];
	}	
	
}

//we need to proxy the widget scene
$.getScene = function(){
	return $.sceneProxy.getView();
}

function exitScene() {

	$.trigger('closing');

	SoundsLibrary.hasQuestionSound() && SoundsLibrary.removeQuestionSound();

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







