var args = arguments[0] || {};
var Consts = require('gameUtils/Constants');
var utils = require('gameUtils/Utils');
require('de.marcelpociot.imagefromgif');
var Map = require('ti.map');
$.mapView.mapType = Map.HYBRID_TYPE;
var coords = [];

//---------------- IMPORTS ----------------//
var assetsPath = '';
var cbOnFadeIn = null;

$.descriptionArea.initWithStyle = function(params) {
    var params = params || {};
    assetsPath = params.assetsPath;
    $.descriptionArea.backgroundImage = params.assetsPath + params.descriptionBackground;

    if (params.descriptionTitle){
        $.infoLbl.text = params.descriptionTitle;
    }
}

$.descriptionArea.setup = function(params) {
    var params = params || {};

    if (params.enabled === false) {
        $.descriptionArea.enabled = false;
        $.descriptionArea.opacity = 0;
    }

    $.descriptionArea.behavior = params.type;
    $.descriptionArea.isHidden = params.isHidden || false;
    $.descriptionArea.keepUntilNextQuestion = params.keepUntilNextQuestion || false;
    $.descriptionArea.usePreviousArea = params.usePreviousArea || false;

    if (!params.fileName || params.fileName === "") {
        $.imageQuiz.opacity=0;
        //return;
    }
    
    if (params.type === Consts.AREA_DESCRIPTION_FORMAT_JPG || params.type === Consts.AREA_DESCRIPTION_FORMAT_PNG) {
        var format = (params.type === Consts.AREA_DESCRIPTION_FORMAT_JPG) ? '.jpg' : '.png';
        var image = (params.isStreamable) ? params.fileName : assetsPath + params.fileName + format;
        Ti.API.info(image);
        $.imageQuiz.image = 'dataQuestiograms/kids/description_cow.png';
       // alert($.imageQuiz.image);
    } else
    if (params.type === Consts.AREA_DESCRIPTION_FORMAT_GIF) {
        var image = assetsPath + params.fileName;
        $.imageQuiz.gif = image + '-break.gif';
        $.imageQuiz.gifComplete = image + '-complete.gif';
    } else
    if (params.type === Consts.AREA_DESCRIPTION_FORMAT_VIDEO) {
        $.videoPlayer.url = (params.isStreamable) ? params.fileName : assetsPath + params.fileName;
        $.videoPlayer.stop();
    }  else
    if (params.type === Consts.AREA_DESCRIPTION_FORMAT_MAP) {
        $.mapView.region = params.region;
        cbOnFadeIn = function() {
            if (params.annotation) {
                if (!params.annotation.latitude) {
                    params.annotation.latitude = params.region.latitude;
                }
                if (!params.annotation.longitude) {
                    params.annotation.longitude = params.region.longitude;
                }
                addCircle(params.annotation);
            }
        }
        if(params.zoomInOnEnd) {

        }
    } else
    if (params.type === Consts.AREA_DESCRIPTION_FORMAT_STREET_VIEW) {
        setTimeout(function(){

            var data = {};

            if (params.position) {
                data.position = {};
                _.extend(data.position, params.position);
            };

            if (params.marker) {
                data.marker = {};
                params.marker.image = assetsPath + params.marker.image;
                _.extend(data.marker, params.marker);
            };

            setTimeout(function(){
                Ti.App.fireEvent('setPosition', data);
            }, 2000);

        }, 2000);
    } 
}

$.descriptionArea.showCompleteGif = function() {
    $.imageQuiz.gif = $.imageQuiz.gifComplete;
}

$.descriptionArea.fadeOut = function(cb) {

    if ($.descriptionArea.enabled === false) {
        return;
    }

    if ($.descriptionArea.keepUntilNextQuestion) {
        cb && cb();
        return;
    };

    var a = Ti.UI.createAnimation({
        duration: 500,
        opacity: 0
    });
    a.addEventListener('complete', function() {
        cb && cb();
    });

    if (isVideo($.descriptionArea.behavior)) {
        $.videoPlayer.animate(a);   
        $.videoPlayer.stop();
    } else 
    if ($.descriptionArea.behavior === Consts.AREA_DESCRIPTION_FORMAT_MAP) {
        $.mapView.animate(a);   
    } else 
    if ($.descriptionArea.behavior === Consts.AREA_DESCRIPTION_FORMAT_STREET_VIEW) {
        $.streetView.animate(a);  
    } else {
        $.imageQuiz.animate(a);   
    }
};

$.descriptionArea.fadeIn = function(cb) {

    if ($.descriptionArea.enabled === false) {
        return;
    }

    if ($.descriptionArea.usePreviousArea) {
        cbOnFadeIn && cbOnFadeIn();
        cb && cb();
        cbOnFadeIn = null;
        return;
    };

    var a = Ti.UI.createAnimation({
        duration: 500,
        opacity: 1
    });
    a.addEventListener('complete', function() {
        cbOnFadeIn && cbOnFadeIn();
        cb && cb();
        cbOnFadeIn = null;
    });
    
    if (isVideo($.descriptionArea.behavior)) {
        $.videoPlayer.animate(a);   
        $.videoPlayer.play();
    } else 
    if ($.descriptionArea.behavior === Consts.AREA_DESCRIPTION_FORMAT_MAP) {
        $.mapView.animate(a);  
    } else 
    if ($.descriptionArea.behavior === Consts.AREA_DESCRIPTION_FORMAT_STREET_VIEW) {
        $.streetView.animate(a);  
    } else {
        $.imageQuiz.animate(a);   
    }   
};

$.descriptionArea.cleanUp = function() {
    $.mapView.removeAllAnnotations();
    //$.streetView.release()
    $.streetView = null;
    $.imageQuiz = null;
    $.descriptionArea = null;
    $.videoPlayer = null;
    $.mapView = null;
    $.destroy();
    $.off();
};

function addAnnotation(params) {

    _.extend(params, {
        image: assetsPath + 'pin.png',
        animate : true
    });

    var annotation = Map.createAnnotation(params);
    $.mapView.addAnnotation(annotation);
   //$.mapView.selectAnnotation(annotation);
}

function addCircle(params) {
    _.extend(params, {
        radius: 100,
        fillColor: "#20FF0000",
        strokeWidth:2,
        strokeColor:'red',
        center: {
            latitude: params.latitude,
            longitude: params.longitude,
        }
    });

    var circle = Map.createCircle(params);
    $.mapView.addCircle(circle);

    coords.push({
        latitude: params.latitude,
        longitude: params.longitude
    });
    /*
    moveCamera({
        latitude: params.latitude,
        longitude: params.longitude
    });
    */
    drawRoute();
}

function moveCamera(params) {

    var params = params || {};

    var pariscam = Map.createCamera({
        altitude: 1000000, 
        centerCoordinate: {
            longitude: params.latitude,
            latitude: params.longitude
        }, 
        heading: utils.iRandom(-10, 10), 
        pitch: utils.iRandom(-60, 60)
    });

    $.mapView.animateCamera({
        camera: pariscam,
        curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
        duration: 3000
    });
}

function drawRoute() {
    if (coords.length < 2) return;

    var route = Map.createRoute({
        width: 4,
        color: '#f00',
        points: coords
    });
    $.mapView.addRoute(route);
}

function isVideo(behavior) {
    return behavior === Consts.AREA_DESCRIPTION_FORMAT_VIDEO;
}

//---------------- INSTANCE AND VAR DECLARATIONS ----------------//

