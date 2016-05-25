var args = arguments[0] || {};
//---------------- IMPORTS ----------------//
var plasticine = require('Plasticine');
var platino = require('io.platino');
var game = Alloy.Globals.gameView;
var Consts = require('gameUtils/Constants');
var utils = require('gameUtils/Utils');
var SCREEN_H = game.screen.height;
var SCREEN_W = game.screen.width;
//---------------- INSTANCE AND VAR DECLARATIONS ----------------//
var background = $.backgroundProxy.getView();
var backgroundQuestion = $.backgroundQuestionProxy.getView();
var sun = $.sun.getView();
var hills = [$.hills1.getView(), $.hills2.getView()];
var clouds = [$.cloud1.getView(), $.cloud2.getView()/*, $.cloud3.getView()*/];
var bases = [$.base1.getView(), $.base2.getView()];
var particles = $.particles.getView();
var boxShadow = $.boxShadow.getView();

var TIME_TRANSITION = Consts.DELAY_SHOW_QUESTION*1.2;

var style = {
    assetsPath: ''
}

function init() {
    setBase();
    setBackgroundHills();
    setSun();
    
    setClouds();
    particles.move(SCREEN_W*0.5, bases[0].y);
    particles.stop();
    boxShadow.move(SCREEN_W*0.5 - boxShadow.width*0.5, bases[0].y + boxShadow.height*0.4);
    boxShadow.scale(0,0);
}
init();

function setBackgroundHills() {

    var ratioHills = SCREEN_W/hills[0].width;

    _.extend(hills[0], {
        x: 0, 
        y: SCREEN_H - hills[0].height*bases[0].heightFactor*1.2,
        width: SCREEN_W, 
        height: hills[0].height*bases[0].heightFactor*1.2
    });
    _.extend(hills[1], {
        x: SCREEN_W, 
        y: SCREEN_H - hills[1].height*bases[0].heightFactor*1.2,
        width: SCREEN_W, 
        height: hills[1].height*bases[0].heightFactor*1.2
    });
};

function setSun() {

    _.extend(sun, {
        x: 200, 
        y: 0,
        animateToRight: true, 
        oscilate: function(){
            if (sun.animateToRight) {
                if (sun.x + sun.width > SCREEN_W - 200) {
                    sun.animateToRight = false;
                } else {
                    sun.transform(platino.createTransform({
                        duration: TIME_TRANSITION,
                        x: sun.x + 100
                    }))
                }
            } else {
                if (sun.x < 200) {
                    sun.animateToRight = true;
                } else {
                    sun.transform(platino.createTransform({
                        duration: TIME_TRANSITION,
                        x: sun.x - 100
                    }))
                }
            }
        } 
    });
}

function setBase() {

    for (var i=0, l = bases.length; i<l; i++) {
        var base = bases[i];

        // Set file size and position:
        var fileWidth =  base.totalWidth/base.visibleWidth;
        _.extend(base, {
            x: 0 + SCREEN_W*fileWidth*i, //SCREEN_W*0.5 - base.width*0.5, 
            y: SCREEN_H - base.height*fileWidth, 
            width: SCREEN_W*fileWidth,
            height: base.height*fileWidth,
            heightFactor : fileWidth
        });

        // Set transforms
        _.extend(base, {
            trHide: platino.createTransform({
                index: i,
                duration: TIME_TRANSITION,
                easing: platino.ANIMATION_CURVE_EASE_OUT
            }),
            trShow: platino.createTransform({
                index: i,
                duration: TIME_TRANSITION,
                easing: platino.ANIMATION_CURVE_EASE_OUT
            }),
            onTrHideComplete: function(e){

                var index = e.source.index;

                if (bases[index].x < -SCREEN_W*0.5) {
                    bases[index].x = bases[index].width - 5;
                } 
            }
        });
        base.trHide.addEventListener('complete', base.onTrHideComplete);
    }

    
}


function setClouds() {

    for (var i=0, l=clouds.length; i<l; i++) {
        var cloud = clouds[i];

        _.extend(cloud, {
            x: utils.iRandom(0, SCREEN_W), 
            y: utils.iRandom(10, SCREEN_H*0.3),
            trMove: platino.createTransform({
                duration: utils.iRandom(20000, 50000),
                x: -cloud.width
            }),
            onTrMoveComplete: function(e) {
                cloud.x = SCREEN_W;
                cloud.y = utils.iRandom(10, SCREEN_H*0.3);
                cloud.transform(cloud.trMove);
            }
        });

        cloud.trMove.addEventListener('complete', cloud.onTrMoveComplete);
        cloud.transform(cloud.trMove);
    }
}

background.showParticles = function() {
    particles.restart();
}

background.showBoxShadow = function() {
    boxShadow.transform(platino.createTransform({
        alpha: 0.8, 
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        easing: platino.ANIMATION_CURVE_EASE_IN
    }))
}

background.hideBoxShadow = function() {
    boxShadow.transform(platino.createTransform({
        alpha:0, 
        scaleX: 0,
        scaleY: 0,
        duration: 400
    }))
}

background.animateForward = function(params) {
   
    for (var i = 0; i< hills.length; i ++) {
        var hill = hills[i];
        hill.transform(platino.createTransform({
            duration: TIME_TRANSITION,
            x: hill.x - SCREEN_W*0.20
        }))
    };

    var i = bases.length;
    
    while(i--) {
        var base = bases[i];
        base.trHide.x = base.x - base.width;
        base.transform(base.trHide);
    };
    sun.oscilate();

    setTimeout(replaceBackgrounds, TIME_TRANSITION + 20);
};

function replaceBackgrounds() {
    for (var i = 0; i< hills.length; i ++) {
        var hill = hills[i];
        if (hill.x <= - hill.width + 50) {
            hill.x += SCREEN_W*2;
            break;
        }
    }
}

background.initWithStyle = function(params) {
    var params = params || {};
    
    style.assetsPath = params.assetsPath;

    _.extend(background, {
        image: params.assetsPath + params.gameBackground,
        width: SCREEN_W,
        height: SCREEN_H,
        trHide: platino.createTransform({
            duration: Consts.TIME_BACKGROUND_FADE_OUT,
            alpha:0.8
        })
    })

    _.extend(backgroundQuestion, {
        width: SCREEN_W,
        height: SCREEN_H,
        trHide: platino.createTransform({
            duration: Consts.TIME_BACKGROUND_FADE_OUT,
            alpha:0
        })
    });


};


background.setQuestionBackground = function(params) {
    var params = params || {};
    
    backgroundQuestion.hasBackground = true;
    backgroundQuestion.keepUntilNextQuestion = params.keepUntilNextQuestion || false;
    backgroundQuestion.usePrevious = params.usePrevious || false;

    Ti.API.info('BACKGROUND');
    Ti.API.info(backgroundQuestion.usePrevious);
    if (backgroundQuestion.usePrevious) return;

    var imagePath = params.fileName;

    var image = style.assetsPath + imagePath;
    Ti.API.info('LOAD TEXTURE '+image);
    game.loadTexture(image);
    setTimeout(function(){
        backgroundQuestion.image = image;
    }, 500);
};

background.showQuestionBackground = function() {    

    if (!backgroundQuestion.hasBackground || backgroundQuestion.usePrevious) return;

    backgroundQuestion.transform(platino.createTransform({
        duration:Consts.TIME_BACKGROUND_FADE_OUT,
        alpha:1
    }))
};

background.hideQuestionBackground = function() {  

    if (!backgroundQuestion.hasBackground || backgroundQuestion.keepUntilNextQuestion) return;  

    backgroundQuestion.hasBackground = false;

    var cbAfterFadeOut = function() {
        backgroundQuestion.trHide.removeEventListener('complete', cbAfterFadeOut);
        if (backgroundQuestion.image != '') {
            game.unloadTexture(backgroundQuestion.image);
            Ti.API.warn('Removing backgroundQuestion texture: '+ backgroundQuestion.image);
        }
    }

    backgroundQuestion.trHide.addEventListener('complete', cbAfterFadeOut);
    backgroundQuestion.transform(backgroundQuestion.trHide);
};

background.darken = function(cb) {

    var cbAfterWait = function() {
        background.trHide.removeEventListener('complete', cbAfterWait);
        background.alpha = 1;
        background.transform(platino.createTransform({
            duration:Consts.TIME_BACKGROUND_FADE_OUT*1.5,
            scaleX:1.02,
            scaleY:1.02,
            red: 0.8, 
            green: 0.2, 
            blue: 0.2,
            autoreverse: true
        }))
        cb && cb();
    }
    
    background.trHide.addEventListener('complete', cbAfterWait);
    background.transform(background.trHide);
}

background.cleanUp = function() {
    $.backgroundProxy  = null;
    background = null;
    $.destroy();
    $.off();
};