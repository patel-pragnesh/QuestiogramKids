var args = arguments[0] || {};

var platino = require('io.platino');

Ti.API.info('ti.game.view');

function init(e){
	Ti.API.info('ti.game.view: init');
	initGameView();
	//drawChildren();
}


function initGameView(){
	var gameViewParams = args || {};
	var gameView = $.gameView;

	for(var k in gameViewParams){
		if(k!==args.children) gameView[k] = gameViewParams[k];
	}

	//TODO: allow background color as hex or triplet code color
	if(args.backgroundColor){
		gameView.color(agrs.backgroundColor[0], args.backgroundColor[1], args.backgroundColor[2]);	
	}
	
	// Set your target screen resolution (in platform-specific units) below
	gameView.TARGET_SCREEN = {
		width:Alloy.CFG.screenWidth,
		height:Alloy.CFG.screenHeight
	};

	//Consider iOS retina images
	if ((Ti.Platform.displayCaps.platformWidth >= 768) && (Ti.Platform.displayCaps.dpi > 250)){
        // Retina-display iPads, high resolution phones (e.g. Galaxy S4), etc.
        gameView.imageSuffix = '@2x'; // change to @3x if you have the assets for it (very high resolution graphics)
        
	}else if (Ti.Platform.displayCaps.platformWidth >= 320)	{
        // Non-retina iPads and retina-display iPhones, etc.
		if ((Ti.Platform.displayCaps.dpi > 200) || (Ti.Platform.displayCaps.platformWidth >= 640)){
            gameView.imageSuffix = '@2x';
		}else {
			gameView.imageSuffix = '';
		}
	}else {
        // All other lower resolution devices...
        gameView.imageSuffix = '';   
	}


	// Sets up screen margins (useful for dynamic layouts, or if you want to implement letterboxing on some devices)
	// For a letter-boxed effect, add black bars to the HUD in the margin regions
	var UpdateMargins = function()	{
		var margin_width = Math.ceil((gameView.screen.width - gameView.TARGET_SCREEN.width) * 0.5);
		
		// defines where screen-within-margin begins (add x and y values when positioning sprites)
		gameView.STAGE_START = {
			x:margin_width,
			y:0
		};
		
		// defines where screen-within-margin ends
		gameView.STAGE_END = {
			x:gameView.screen.width - margin_width,
			y:gameView.screen.height
		};
		
		// defines where Titanium stage starts (outside of Game View)
		gameView.TI_STAGE_START = {
			x:Math.floor(gameView.STAGE_START.x / gameView.touchScaleX),
			y:gameView.STAGE_START.y / gameView.touchScaleY
		};
		
		// defines where Titanium stage ends (outside of Game View)
		gameView.TI_STAGE_END = {
			x:Math.ceil(gameView.STAGE_END.x / gameView.touchScaleX),
			y:gameView.STAGE_END.y / gameView.touchScaleY
		};
		
		// defines Titanium stage size (outside of Game View)
		gameView.TI_STAGE_SIZE = {
			width:gameView.TI_STAGE_END.x - gameView.TI_STAGE_START.x,
			height:gameView.TI_STAGE_END.y - gameView.TI_STAGE_START.y
		};
	};

	// Updates screen size, scale, and margins
	var UpdateScreenSize = function() {
		var screenScale = gameView.size.height / gameView.TARGET_SCREEN.height;
		gameView.screen =  {
			width:gameView.size.width / screenScale,
			height:gameView.size.height / screenScale
		};

		gameView.touchScaleX = gameView.screen.width  / gameView.size.width;
		gameView.touchScaleY = gameView.screen.height / gameView.size.height;
		gameView.screenScale = gameView.screen.height / gameView.TARGET_SCREEN.height;
		
		UpdateMargins();
	};

	gameView.setScene = function(scene){
			gameView.currentScene = scene; 

			// push loading scene and start the game
			gameView.pushScene(gameView.currentScene);
			gameView.start();
	};

	// Loads MainScene.js as starting point to the app
	gameView.addEventListener('onload', function(e) {
			gameView.registerForMultiTouch();
			UpdateScreenSize();
		}
	);

	gameView.addEventListener('onsurfacechanged', function(e) {
			gameView.orientation = e.orientation;
			UpdateScreenSize();
        }    
    );

	// Convenience function to convert Titanium coordinate from a Platino coordinate
	gameView.getTiScale = function(x, y) {
		return {
			x: (x / gameView.touchScaleX),
			y: (y / gameView.touchScaleY)
		};
	};

	// Whenever a sprite is created, you should call this function to ensure width and height
	// properties always return the expected value depending on the device screen
	gameView.setupSpriteSize = function(sprite)	{
		var width = sprite.width / gameView.screenScale;
		var height = sprite.height / gameView.screenScale;
		sprite.width = (width < 1) ? 1 : width;
		sprite.height = (height < 1) ? 1 : height;
	};

	// Converts screen touch event coordinates to Platino GameView coordinates
	gameView.locationInView = function(event) {
        var e = { type:event.type, x:event.x, y:event.y, source:event.source };
        var x = e.x * gameView.touchScaleX;
        var y = e.y * gameView.touchScaleY;
        e.x = x;
        e.y = y;
        return e;
	};

	gameView.cpY = function(y){
		return (gameView.screen.height - y);
	};
	
};


//tries to add any children in the xml to the scene
//A gameView may have two kinds of children: scenes and HUD controls
//At this point only HUDs are supported
//TODO: add support for scenes
function drawChildren(children){
	var children = args.children || [];
	var views = [];
	
	if (!children || children.length === 0) {
		return;	
	}
	
	//Draw HUDs
	for(var i = 0, j = children.length; i < j; i++){
		Ti.API.info('Adding HUD "' + i + '"');
		// fix: https://jira.appcelerator.org/browse/TC-3583 (thx, fokke!)
		if (!children[i]) {
			continue;
		}
		
		$.gameView.addHud(children[i]);
		
	}
	
}

init();
