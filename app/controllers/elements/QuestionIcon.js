var args = arguments[0] || {};
var Consts = require('gameUtils/Constants');
//---------------- IMPORTS ----------------//
var assetsPath = '';

$.questionIcon.initWithStyle = function(params) {
    var params = params || {};
    assetsPath = params.assetsPath;
}

$.questionIcon.setup = function(params) {
    var params = params || {};
    $.questionIcon.behavior = params.type;
  
    if (params.type === Consts.TYPE_QUESTION_ICON) {
        var image = assetsPath + params.fileName + '.png';
        $.icon.image = image;
        //$.questionIcon.opacity = 1;
    } else
    if (params.type === Consts.TYPE_QUESTION_NONE) {
        //$.questionIcon.opacity = 0;
    }
}

$.questionIcon.fadeOut = function(cb) {

    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NONE) return;

    var a = Ti.UI.createAnimation({
        duration: 500,
        opacity: 0
    });
    a.addEventListener('complete', function() {
        cb && cb();
    });
    $.questionIcon.animate(a);   
}

$.questionIcon.fadeIn = function(cb) {

    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NONE) return;

    var a = Ti.UI.createAnimation({
        duration: 500,
        opacity: 1
    });

    a.addEventListener('complete', function() {
        cb && cb();
    });
    $.questionIcon.animate(a);  
};

$.questionIcon.stopTimer = function(cb) {

    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NONE) return;
    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NO_TIMER) return;

    // Maybe I'm missing something, but I can´t stop a view animation
    // This is a workaround removing the timebar and creating it again, 
    // this should do the trick in the meantime....

    var newBar = getNewTimeBar({width:$.timeBar.animatedCenter.x*2});
    $.questionIcon.remove($.timeBar);
    $.timeBar = newBar;
    $.questionIcon.add($.timeBar);

};

$.questionIcon.resetTimer = function(cb) {

    var a = Ti.UI.createAnimation({
        duration: 50,
        width: Titanium.Platform.displayCaps.platformWidth,
        left: 0
    });

    $.timeBar.animate(a);   
};

$.questionIcon.decreaseTimer = function(val) {

    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NONE) return;
    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NO_TIMER) return;

    var val = val || Consts.TIMER_DECREASE_DEFAULT; 
    var a = Ti.UI.createAnimation({
        duration: 100,
        width: $.timeBar.width - val,
    });

    $.timeBar.animate(a);
};


$.questionIcon.startTimer = function(cb) {

    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NONE) return;
    if ($.questionIcon.behavior === Consts.TYPE_QUESTION_NO_TIMER) return;

    var b = Ti.UI.createAnimation({
        duration: Consts.TIME_QUESTION_DEFAULT,
        width: 0,
        left: 0,
        delay: 100,
        curve: Ti.UI.ANIMATION_CURVE_LINEAR
    });
    b.addEventListener('complete', function() {
         cb && cb();
    });
    $.timeBar.animate(b);   
};

function getNewTimeBar(params) {
    var timeBarStyle = $.createStyle({ classes: ['timeBar'] , width: params.width});
    var timeBar = Ti.UI.createImageView(timeBarStyle);
    return timeBar;
}


$.questionIcon.cleanUp = function() {
    $.icon = null;
    $.timeBar = null;
    $.questionIcon = null;
    $.destroy();
    $.off();
};





