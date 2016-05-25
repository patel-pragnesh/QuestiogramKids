var args = arguments[0] || {};
var Consts = require('gameUtils/Constants');
var utils = require('gameUtils/Utils');
var platino = require('io.platino');
var plasticine = require('Plasticine');
var game = Alloy.Globals.gameView;

var SCREEN_H = game.screen.height;
var SCREEN_W = game.screen.width;
//---------------- IMPORTS ----------------//
var assetsPath = '';
var cbOnFadeIn = null;

var mainItem = $.mainItemProxy.getView();
var boxEnigma = $.boxEnigmaProxy.getView();

var transforms = {
    fadeIn: platino.createTransform({ duration: 200, alpha: 1}), 
    fallDown: platino.createTransform({ duration: 300, y: SCREEN_H*0.35 - boxEnigma.height*0.5, easing: platino.ANIMATION_CURVE_EASE_IN}), 
    fadeOut: platino.createTransform({ duration: 200, alpha: 0})
}

function init() {
    mainItem.moveCenter(SCREEN_W*0.5, SCREEN_H*0.32);
}
init();

mainItem.initWithStyle = function(params) {
    var params = params || {};
    assetsPath = params.assetsPath;
    
}

mainItem.setup = function(params) {
    var params = params || {};
    mainItem.behavior = params.type || '';
    mainItem.isHidden = params.isHidden || false;
    mainItem.keepUntilNextQuestion = params.keepUntilNextQuestion || false;
    mainItem.usePreviousArea = params.usePreviousArea || false;
    mainItem.coverType = params.cover;

    if (mainItem.coverType === Consts.MAIN_ITEM_COVER_NONE) {
        mainItem.alpha = 0;
        boxEnigma.alpha = 0;

    } else
    if (mainItem.coverType === Consts.MAIN_ITEM_COVER_BOX) {
        mainItem.y = -mainItem.height*1.2;
        boxEnigma.angle = 0;
        boxEnigma.center = {x:mainItem.width*0.5, y: mainItem.height*0.5};
        mainItem.alpha = 1;
        boxEnigma.alpha = 1;
    }

    var format = (params.type === Consts.AREA_DESCRIPTION_FORMAT_JPG) ? '.jpg' : '.png';

    var image = assetsPath + params.fileName + format;
    game.loadTexture(image);
    mainItem.image = image;

}


mainItem.fadeOut = function(cb) {

    if (mainItem.keepUntilNextQuestion) {
        cb && cb();
        return;
    };

    var cbAfterOut = function() {
        transforms.fadeOut.removeEventListener('complete', cbAfterOut);
        game.unloadTexture(mainItem.image);
        cb && cb();
    }

    transforms.fadeOut.addEventListener('complete', cbAfterOut);
    mainItem.transform(transforms.fadeOut);

};

mainItem.throwBoxEnigma = function() {

    boxEnigma.transform(platino.createTransform({
        duration: 500,
        y: - boxEnigma.height*1.8,
        angle: 30,
        easing: platino.ANIMATION_CURVE_EASE_OUT
    }))

};

mainItem.fadeIn = function(cb) {

    if (mainItem.usePreviousArea) {
        cbOnFadeIn && cbOnFadeIn();
        cb && cb();
        cbOnFadeIn = null;
        return;
    };

    var cbAfterIn = function() {
        transforms.fadeIn.removeEventListener('complete', cbAfterIn);
        cbOnFadeIn && cbOnFadeIn();
        cb && cb();
        cbOnFadeIn = null;
    }

    if (mainItem.coverType === Consts.MAIN_ITEM_COVER_NONE) {
        transforms.fadeIn.addEventListener('complete', cbAfterIn);
        mainItem.transform(transforms.fadeIn);
    } else
    if (mainItem.coverType === Consts.MAIN_ITEM_COVER_BOX) {
        transforms.fallDown.addEventListener('complete', cbAfterIn);
        mainItem.transform(transforms.fallDown);
    }
};

mainItem.isHiddenByBox = function() {
    return mainItem.coverType === Consts.MAIN_ITEM_COVER_BOX;
}

mainItem.cleanUp = function() {
    mainItem = null;
    $.destroy();
    $.off();
};
