var args = arguments[0] || {};
var Consts = require('gameUtils/Constants');
var platino = require('io.platino');
var plasticine = require('Plasticine');
var helper = require('gameUtils/ResolutionHelper');
var utils = require('gameUtils/Utils');
var animation = plasticine.Animations;
var game = Alloy.Globals.gameView;
var Map = require('ti.map');
var SCREEN_H = game.screen.height;
var SCREEN_W = game.screen.width;

//---------------- IMPORTS ----------------//
var resolutionArea = $.resolutionAreaProxy.getView();
var style = {};
var answers = [];
var touchEnabled = false;
var mapview = null;
var cleanButton = $.cleanButtonProxy.getView();

resolutionArea.initWithStyle = function(params) {
    var params = params || {};

    // Set resolutionArea size and placement:
    _.extend(resolutionArea, {
        width: SCREEN_W,
        height: SCREEN_H,
        y: 0
    });
    // Set style of resolutionArea:
    _.extend(style, {
        assetsPath: params.assetsPath || '',
        cacheDir: params.cacheDir || '',
        boxTextAnswer: params.boxTextAnswer
    })
}

resolutionArea.setEventHandling = function(event) {
    var event = event || function(){};
    // onAction keeps the callback of Questiogram scene
    resolutionArea.onAction = event;
}

resolutionArea.setup = function(params) {

    var params = params || {};

    _.extend(resolutionArea, {
        behavior: params.behavior,
        type: params.type
    })

    // Build resolutionArea regarding behavior and type of question
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_SELECT) {

        if (resolutionArea.type === Consts.AREA_RESOLUTION_TYPE_VISUAL) {
            createVisualAnswers({
                answers: params.answers, 
                rightAnswer: params.rightAnswer,
                cached: params.cachedImages,
                layout: params.layout || ''
            });

            resolutionArea.onTouch = listenerBehaviorSelect;

        } else 
        if (params.type === Consts.AREA_RESOLUTION_TYPE_TEXT) {

            createTextAnswers({
                answers: params.answers, 
                rightAnswer: params.rightAnswer,
                layout: params.layout || ''
            });
            resolutionArea.onTouch = listenerBehaviorSelect;
        }

        helper.enableOnTouchAction(resolutionArea);

    } else
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_JOIN) {

        createVisualJoins({
            answers: params.answers
        });

        resolutionArea.onTouch = listenerBehaviorJoin;
        resolutionArea.solution = params.solution;

        cleanButton.alpha = 1;

        helper.enableOnTouchAction(resolutionArea);

    } else
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_MAP) {
        createMapView(params.region);
        game.onTouch = listenerBehaviorMap;
        resolutionArea.solution = params.solution;
        helper.enableOnTouchAction(game);
    } else
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT) {
        createInputBox();
        resolutionArea.hasListeners = false;
        resolutionArea.solution = params.solution;
    }

    touchEnabled = true;
    
}

function createVisualAnswers(params) {

    var params = params || {};
    var baseCircle = getStyle('baseCircle');
    var backgroundCircle = getStyle('backgroundCircle');
   // var backgroundCircleImages = ['bkgBtn1', ]

    var styleAnswer = (params.layout != '') ? getStyle('noSizeSelectAnswer') : getStyle('visualSelectAnswer');

    for (var i=0; i < params.answers.length; i++) {

        var image;
        if (params.cached) {
            image = Ti.Filesystem.getFile(style.cacheDir.resolve(), params.answers[i]);
        } else {
            image = style.assetsPath + params.answers[i] + '.png';
        }

        var baseCircle = plasticine.createSprite(baseCircle, {
            image: 'dataQuestiograms/kids/baseCircle.png', // If is defined on Tss, only works for first sprite
            index: i,
            y: -SCREEN_H,
            isRightAnswer: (i === params.rightAnswer) ? true : false
        });

        var backgroundCircle = plasticine.createSprite(backgroundCircle, {
            image: 'dataQuestiograms/kids/'+'bkgBtn'+parseInt(i+1)+'.png', // If is defined on Tss, only works for first sprite
            index: i
        });

        var face = plasticine.createSprite(styleAnswer, {
            index: i,
            image: image
        });
 
        face.moveCenter(baseCircle.width*0.5, baseCircle.height*0.5);

        baseCircle.addChildNode(backgroundCircle);
        baseCircle.addChildNode(face);

        baseCircle.spriteBackground = backgroundCircle;
        baseCircle.spriteFace = face;

        resolutionArea.addChildNode(baseCircle);
        answers.push(baseCircle);
    }

    if (params.layout != '') {
        distributeSelectAnswers(params.layout); 
    } else {
        distributeSelectAnswers(Consts.AREA_RESOLUTION_LAYOUT_HORIZONTAL);
    }
    
}

function createTextAnswers(params) {

    var params = params || {};
    var boxStyle = getStyle('boxSelectAnswer');
    var textStyle = getStyle('textSelectAnswer');

    for (var i=0; i < params.answers.length; i++) {

        var answer = plasticine.createSprite(style, {
            index: i,
            isRightAnswer: (i === params.rightAnswer) ? true : false,
            image: style.assetsPath + style.boxTextAnswer
        });

        resolutionArea.addChildNode(answer);

        answer.textAnswer = plasticine.createTextSprite(textStyle, {
            text: params.answers[i]
        });

        answer.textAnswer.move(answer.width*0.5 - answer.textAnswer.width*0.5, answer.height*0.5 - answer.textAnswer.height*0.5);

        answer.addChildNode(answer.textAnswer);
        answers.push(answer);
    }

    if (params.layout != '') {
        distributeSelectAnswers(params.layout);
    } else {
        distributeSelectAnswers(Consts.AREA_RESOLUTION_LAYOUT_VERTICAL);
    }

    
}

function distributeSelectAnswers(type) {

    if (type === Consts.AREA_RESOLUTION_LAYOUT_VERTICAL) {
        helper.distributeTextAnswers(answers);
    } else
    if (type === Consts.AREA_RESOLUTION_LAYOUT_HORIZONTAL) {
        helper.distributeVisualAnswers(answers);
    } 
}

function createVisualJoins(params) {

    var params = params || {};
    var styleAnswer = getStyle('visualJoin');

    for (var i=0; i < params.answers.length; i++) {
        var answer = plasticine.createSprite(styleAnswer, {
            index: i,
            name: params.answers[i],
            hasJoin: false,
            image: style.assetsPath + params.answers[i] + '.png'
        });
 
        resolutionArea.addChildNode(answer);
        answers.push(answer);
    }
    
    helper.distributeVisualJoins(answers);
}

function createMapView(region) {

    var mapStyle = $.createStyle({classes: ['map'], 
        mapType: Map.NORMAL_TYPE,
        height: Titanium.Platform.displayCaps.platformHeight*0.5,
        top: Titanium.Platform.displayCaps.platformHeight*0.5,
        region: region
    });

    mapview = Map.createView(mapStyle);

    game.add(mapview);
}

function createInputBox() {

    var boxTextStyle = $.createStyle({classes: ['inputBox'], 
        top: Titanium.Platform.displayCaps.platformHeight*0.51
    });

    boxText = Ti.UI.createTextArea(boxTextStyle);

    boxText.addEventListener('return', function(e) {
         if (e.value.toLowerCase() === resolutionArea.solution.toLowerCase()) {
            resolutionArea.onAction({success: Consts.ACTION_SUCCESS});
        } else {
            resolutionArea.onAction({success: Consts.ACTION_FAIL});
        }
    });

    game.add(boxText);
}


function listenerBehaviorSelect(e) {

    if (!touchEnabled) return;

    if (e.type === "touchstart") {

        for (var i=0; i < answers.length; i++) { 

            var selectedAnswer = answers[i];

            if (contains(selectedAnswer, e.x, e.y)) {
                touchEnabled = false;
                selectedAnswer.selected = true;
                var response = (selectedAnswer.isRightAnswer) ? Consts.ACTION_SUCCESS : Consts.ACTION_FAIL;
                resolutionArea.onAction({success: response});
                break;
            }

        }
    }
}

function listenerBehaviorJoin(e) {

    if (!touchEnabled) return;

    if (e.type === "touchstart") {

        if (contains(cleanButton, e.x, e.y)) {
            animation.animateButton(cleanButton, function(evt){
                for (var i=0; i < answers.length; i++) { 
                    var answer = answers[i];
                    answer.selected = false;
                    answer.hasJoin = false;
                    answer.join && removeJoin(answer);
                }
                resolutionArea.onAction({cleanResolutionArea: true});
                return;
            });
        }

        for (var i=0; i < answers.length; i++) { 

            var selectedAnswer = answers[i];

            if (contains(selectedAnswer, e.x, e.y)) {
                //touchEnabled = false;
                if (!selectedAnswer.hasJoin) {
                    selectedAnswer.hasJoin = true;
                    selectedAnswer.transform(platino.createTransform({
                        duration:100,
                        scaleX: 0.9, 
                        scaleY: 0.9,
                        autoreverse: true
                    }))
                    selectedAnswer.selected = true;
                    addJoin(selectedAnswer);
                }
                break;
            }

        }
    } else
    if (e.type === "touchmove") {

        for (var i=0; i < answers.length; i++) { 

            var selectedAnswer = answers[i];

            if(selectedAnswer.hasJoin && selectedAnswer.selected) {
                moveJoin(selectedAnswer, e.x, e.y);
            }
        }
    } else
    if (e.type === "touchend") {

        var inAnswer = false;
        var selected = -1;

        for (var i=0; i < answers.length; i++) { 

            var selectedAnswer = answers[i];
            if(selectedAnswer.hasJoin && selectedAnswer.selected) {
                selected = i;
                for (var j=0; j < answers.length; j++) { 
                    if (selectedAnswer.index != j && contains(answers[j], e.x, e.y)) {
                        inAnswer = true;
                        answers[j].hasJoin = true;
                        selectedAnswer.join.dataLink = {
                            source: i, 
                            dest: j
                        }
                        moveJoin(selectedAnswer, answers[j].center.x, answers[j].center.y);
                        break;
                    }
                }
            }
        }

        if (selected != -1 && !inAnswer) {
            var selectedAnswer = answers[selected];
            removeJoin(selectedAnswer);
        } else {
            checkJoins();
        }
    }
}

function listenerBehaviorMap(e) {

    if (e.type === "touchstart" && mapview.onTouchEnabled) {
        var addNewAnnotation = function addNewAnnotation(lat, lng){
            var annotation = Map.createAnnotation({
                latitude : lat,
                longitude : lng,
                animate : true,
                id : 1,
            });
            mapview.addAnnotation(annotation);
        };

        var coordinates = helper.calculateLatLngfromPixels(mapview, e.x, e.y - Titanium.Platform.displayCaps.platformHeight*0.5);
        addNewAnnotation(coordinates.lat, coordinates.lon);  

        var a = coordinates.lat - resolutionArea.solution.Lat
        var b = coordinates.lon - resolutionArea.solution.Lon

        var c = Math.sqrt( a*a + b*b );

        if (c < Consts.MAX_GEO_DISTANCE_SUCCESS) {
            resolutionArea.onAction({success: Consts.ACTION_SUCCESS});
        } else {
            resolutionArea.onAction({success: Consts.ACTION_FAIL});
        }
    }
}

resolutionArea.cleanAnnotations = function() {
    mapview.removeAllAnnotations();
}

function addJoin(parent) {
    var styleJoin = getStyle('lineJoin');
    var join = plasticine.createSprite(styleJoin);
    join.move(parent.x + parent.width*0.5, parent.y + parent.height*0.5);
    resolutionArea.addChildNode(join);
    parent.join = join;
}

function removeJoin(selectedAnswer) {
    selectedAnswer.join.height = 0;
    selectedAnswer.join.width = 0;
    selectedAnswer.join.x = SCREEN_W*2;
    resolutionArea.removeChildNode(selectedAnswer.join);
    selectedAnswer.join.dispose();
    selectedAnswer.join = null;
    selectedAnswer.selected = false;
    selectedAnswer.hasJoin = false;
}

function moveJoin(parent, _x, _y) {
    var distX = parent.center.x - _x;
    var distY = parent.center.y - _y;

    parent.join.angle = 90 + Math.atan2(distY, distX) * 180/Math.PI;
    parent.join.height = Math.sqrt(distX*distX + distY*distY);
}

function checkJoins(src, dst) {

    var dataJoins = {};
    
    // Populate dataJoins with current joins
    for (var i=0; i < answers.length; i++) { 
        answers[i].selected = false;
        if (answers[i].join){
            var data = answers[i].join.dataLink;
            dataJoins[answers[data.source].name] = answers[data.dest].name;
        }
    }

    var success = true;

    _.each(dataJoins, function(val, key){

        if (_.isUndefined(resolutionArea.solution[key])) {
            if (resolutionArea.solution[val] != key) {
                success = false;
            }
        } else {
            if (resolutionArea.solution[key] != val) {
                success = false;
            }
        }
    });

    if (_.size(dataJoins) === _.size(resolutionArea.solution) && success) {
        resolutionArea.onAction({success: Consts.ACTION_SUCCESS});
    }

}

function contains(obj, _x, _y) {
    return obj.contains(resolutionArea.x + _x, resolutionArea.y + _y);
}

resolutionArea.animatePreValidation = function() {
    for (var i = 0; i < answers.length; i++) { 
        answers[i].selected && makeSmallOnPreValidation(answers[i]);
    }
};

resolutionArea.animatePostValidation = function() {
    for (var i = 0; i < answers.length; i++) { 
        var answer = answers[i];
        makeBigOnPostValidation(answer); 

        if (answer.selected) {
            if (answer.isRightAnswer) {
                setStyleAnswerAsSuccess(answer);
            } else {
                setStyleAnswerAsFail(answer);
                answer.selected = 0;
                touchEnabled = true;
            }
        }
    }
};

function setStyleAnswerAsSuccess(answer) {
    answer.color(0.1, 1, 0.1);
    answer.spriteBackground.transform(platino.createTransform({
        duration: 300,
        autoreverse: true,
        scaleX: 0.8,
        scaleY: 0.8,
        easing: platino.ANIMATION_CURVE_EASE_OUT
    }))
    answer.spriteFace.transform(platino.createTransform({
        duration: 300,
        autoreverse: true,
        scaleX: 1.2,
        scaleY: 1.2,
        easing: platino.ANIMATION_CURVE_EASE_OUT
    }))
    answer.transform(platino.createTransform({
        duration: 1000,
        red: 1, 
        green: 1, 
        blue: 1,
        easing: platino.ANIMATION_CURVE_EASE_OUT
    }))
}

function setStyleAnswerAsFail(answer) {
    answer.color(1, 0.1, 0.1);
    answer.transform(platino.createTransform({
        duration: 500,
        red: 1, 
        green: 1, 
        blue: 1,
        easing: platino.ANIMATION_CURVE_EASE_OUT
    }))
}

function makeSmallOnPreValidation(obj) {
    obj.transform(platino.createTransform({
        duration: Consts.TIME_BACKGROUND_FADE_OUT,
        scaleX: 0.85,
        scaleY: 0.85,
        easing: platino.ANIMATION_CURVE_EASE_IN
    }))
}

function makeBigOnPostValidation(obj) {
    obj.transform(platino.createTransform({
        duration: 100,
        scaleX: 1,
        scaleY: 1,
        easing: platino.ANIMATION_CURVE_EASE_OUT
    }))
}

resolutionArea.clean = function() {

    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_SELECT || 
        resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_JOIN) {

        helper.disableOnTouchAction(resolutionArea);

        for (var i=0; i < answers.length; i++) { 
            var answer = answers[i];
            answer.clearTransforms();
            if (answer.textAnswer) {
                answer.removeChildNode(answer.textAnswer);
                answer.textAnswer.dispose();
                answer.textAnswer = null;
            }
            if (answer.spriteBackground) {
                answer.removeChildNode(answer.spriteBackground);
                answer.spriteBackground.dispose();
                answer.spriteBackground = null;
            }
            if (answer.spriteFace) {
                answer.removeChildNode(answer.spriteFace);
                answer.spriteFace.dispose();
                answer.spriteFace = null;
            }
            answer.join && removeJoin(answer);
            resolutionArea.removeChildNode(answer);
            answer.dispose();
            answer = null;
        }

        answers.length = 0;

    } else 
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_MAP) {
        helper.disableOnTouchAction(game);
        game.remove(mapview);
        mapview = null;

    } else
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT) {
        game.remove(boxText);
        boxText = null;
    }
}

resolutionArea.fadeOut = function(cb) {

    for (var i=0; i < answers.length; i++) { 
        answers[i].transform(platino.createTransform({
            duration: Consts.DELAY_SETUP_QUESTION*0.5,
            delay: 20*i,
            scaleX:0,
            scaleY:0,
            easing: platino.ANIMATION_CURVE_EASE_OUT
        }))
    }

    cleanButton.alpha = 0;

    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT) {
        var a1 = Ti.UI.createAnimation();
        a1.opacity = 0;
        a1.duration = 100;
        boxText.animate(a1);
    } else
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_MAP) {
        var a1 = Ti.UI.createAnimation();
        a1.opacity = 0;
        a1.duration = 100;
        mapview.animate(a1);
    }

}

resolutionArea.fadeIn = function(cb) {
    for (var i=0; i < answers.length; i++) { 
        answers[i].transform(platino.createTransform({
            duration: Consts.DELAY_SETUP_QUESTION*0.8,
            delay: 20*i,
            scaleX:1,
            scaleY:1,
            easing: platino.ANIMATION_CURVE_EASE_OUT
        }))
    }

    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT) {
        var a1 = Ti.UI.createAnimation();
        a1.opacity = 1;
        a1.duration = 100;
        boxText.animate(a1);
    } else
    if (resolutionArea.behavior === Consts.AREA_RESOLUTION_BEHAVIOR_MAP) {
        var a1 = Ti.UI.createAnimation();
        a1.opacity = 1;
        a1.duration = 100;
        a1.addEventListener('complete', function(){
            mapview.onTouchEnabled = true;
        })
        mapview.animate(a1);
    }
};

function getStyle(type) {
    return $.createStyle({classes:[type]});
}


resolutionArea.cleanUp = function() {

    resolutionArea.clean();

    $.cleanButtonProxy = null;
    $.resolutionAreaProxy = null;
    resolutionArea = null;
    style = null;
    answers = null;
    touchEnabled = null;
    mapview = null;

    $.destroy();
    $.off();
};



//---------------- INSTANCE AND VAR DECLARATIONS ----------------//

