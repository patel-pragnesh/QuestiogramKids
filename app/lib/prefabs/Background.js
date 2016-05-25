//---------------- IMPORTS ----------------//
var platino = require('io.platino');
var plasticine = require('Plasticine');
var utils = require('gameUtils/Utils');
var Consts = require('gameUtils/Constants');
var deviceHandler = require('gameUtils/DeviceHandler');
var Debug = require('core/Debug');
//---------------- INSTANCE AND VAR DECLARATIONS ----------------//
var game = plasticine.gameView;
// Screen constants:
var SCREEN_H = game.screen.height;
var SCREEN_W = game.screen.width;

var backgrounds, line;


exports.create = function(params) {

    var params = params || {};

    backgrounds = {
        up: plasticine.createSprite(getStyle('halfBackgroundUp'), {
            width: SCREEN_W, 
            height: SCREEN_H*0.5
        }),
        down: plasticine.createSprite(getStyle('halfBackgroundDown'), {
            width: SCREEN_W, 
            height: SCREEN_H*0.5
        })
    };

    backgrounds.up.move(0,0);
    backgrounds.down.move(0,SCREEN_H*0.5);

    backgrounds.up.color(1,0,1);
    backgrounds.down.color(1,1,0);

    params.scene.add(backgrounds.up);
    params.scene.add(backgrounds.down);

    line = plasticine.createSprite(getStyle('line'));
    line.ratio = SCREEN_W/line.width;
    line.width = SCREEN_W;
    line.height *= line.ratio;

    line.center = {
        x: SCREEN_W*0.5, 
        y: SCREEN_H*0.5
    }

    params.scene.add(line);


}
