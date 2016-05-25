"use strict";
var deviceHandler = require('DeviceHandler');
var platino = require('io.platino');

var fps = deviceHandler.getFPS();
var textureFilter = deviceHandler.getTextureFilter();

var testMode = (Ti.App.deployType === 'development' || Ti.App.deployType === 'test') ? true : false;

// GameView configuration
var gameViewParams = {
	fps: 						fps,
	enableOnDrawFrameEvent: 	true,
	multitouch: 				false,
	enableOnLoadSpriteEvent: 	testMode,
	enableOnLoadTextureEvent: 	testMode,
	debug: 						testMode,
    usePerspective: 			true,
    textureFilter: 				textureFilter,
    correctionHint: 			platino.OPENGL_FASTEST
	//enableOnFpsEvent : true, // optimization: disables 'onfps' event
	//onFpsInterval : 5000 // sets 'onfps' event interval in msec (default: 5000)
};

// End config options ---->

var GameView = require('core/GameView');
var gameView = new GameView(gameViewParams);
gameView.color(0,0,0);

var Plasticine = {
	Sound: require('core/Sound'),
	Animations: require('core/Animations'),
	gameView: gameView
};

// We should quit using Alloy.Globals.gameView and use Plasticine.gameView instead.
Alloy.Globals.gameView = Plasticine.gameView;

Plasticine.Sound.init();

var firstScene = true;
var scenes = {};

if (OS_ANDROID) {
	// Flag to avoid closing the app twice from menu button
	var winIsClosing = false;
}

/*
 * Opens a new scene and listens for it to be destroyed when triggers the event 'close'
 * @params sceneToLoad(string): relative path to the alloy controller with the scene
*/
Plasticine.openScene = function(sceneToLoad, params) {

	var params = params || {};
	var SceneProxy, scene;
	// Read scenes dict. If path exists, take the scene from scenes[sceneToLoad] property. Otherwise create new scene
	// scene.opened is used in ti.game.scene to know whether to draw the sprites declared in the XML.

	if (scenes[sceneToLoad]) {
		SceneProxy = scenes[sceneToLoad];
		scene = SceneProxy.getScene();
	} else {
		SceneProxy = Alloy.createController(sceneToLoad, params);
		scene = SceneProxy.getScene();
		scene.addEventListener('activated', startCurrentScene);
		SceneProxy.on('close', closeScene);
		scenes[sceneToLoad] = SceneProxy;	
	};

	// Listeners for activated and close events:
	function startCurrentScene() {
		gameView.startCurrentScene();
	};

	// Destroys all references by the scene and the plasticine controller
	function closeScene() {
		SceneProxy.off();
		scene.dispose();
		SceneProxy.destroy();
		scene = null;
		SceneProxy = null;
		delete scenes[sceneToLoad];

		Ti.API.info('Old scene removed');
	}

	// Determines if currentscene is the first scene to show and therefore makes a game.start
	if(firstScene) {
		Ti.API.warn('******* Plasticine. First scene opening');
		firstScene = false;
		gameView.pushScene(scene);
		gameView.start();
	} else {
		Ti.API.info('Replacing scene');
		gameView.currentScene = scene; 
		gameView.replaceScene(gameView.currentScene);
	};
   	
   	return SceneProxy;
}

function extendProperties(args) {
	var o = {};
	for (var i = 0, j = args.length; i < j; i++) {
		_.extend(o, args[i]);
	}
	return o;
};

Plasticine.createSprite = function() {
	var properties = extendProperties(arguments);
	var platinoObj = Alloy.createWidget("ti.game.sprite", properties).getView();
	return platinoObj;
};

Plasticine.createSpriteSheet = function() {
	var properties = extendProperties(arguments);
	var platinoObj = Alloy.createWidget("ti.game.spriteSheet", properties).getView();

	// Now we add a useful feature for spriteSheets that does not have the current version of Platino, 
	// assign a frame to a spritesheet via property (selectedFrame = nameOfFrame):
	if(properties.selectedFrame) {
		platinoObj.selectFrame(properties.selectedFrame);
	};

	return platinoObj;
};

Plasticine.createTextSprite = function() {

	var properties = extendProperties(arguments);
	var platinoObj = Alloy.createWidget("ti.game.textSprite", properties).getView();
	return platinoObj;
};

Plasticine.createParticle = function() {

	var properties = extendProperties(arguments);
	var platinoObj = Alloy.createWidget("ti.game.particle", properties).getView();
	return platinoObj;
};

Plasticine.setWindow = function(params) {
	var params = params || {};
	Plasticine.setupApplicationWindow(params.window);
	Plasticine.setupApplicationLifeCycleHandlers(params);
}
/**
 Most of the code credits below goes to the author of the platino samples. I just took it and optimized for alloy.
 .- Javier
*/

Plasticine.setupApplicationWindow = function(win){
	
	if(OS_ANDROID){
		// Handle android back button on a per-scene basis by adding defining a scene.backButtonHandler()
		// function within your scenes (or delete contents of below function to handle back button globally)

	    win.addEventListener('android:back', function(e) {
	        if (winIsClosing) return;
	        
	        winIsClosing = true;
	        
	        var dlg = Ti.UI.createAlertDialog({ message : L('exit'), buttonNames : [L('ok'),L('cancel')]});
	            dlg.addEventListener("click", function(e) {
	            if (e.index === 0) {
	                
	                dlg.hide();
	                Plasticine.Sound.quit();
	                gameView.currentScene = null;
        			win.close();
	            } else {
	                winIsClosing = false;
	            }
	        });
	    
	        dlg.show();
	    });

		// Instead of using the activity, as an alternative, you can also use focus/blur to pause/resume.		
		win.addEventListener('blur', 
			function(e) {
				Ti.API.info("in $.win blur");
	 			Plasticine.Sound.BeginInterruption();
			}
		);

		win.addEventListener('focus', 
			function(e)	{
				Ti.API.info("in $.win focus");
				Plasticine.Sound.EndInterruption();
			}
		);

		win.addEventListener('close', function(e) {
	        gameView = null;
	        Alloy.Globals.gameWindow = null;
	        win = null;
	    });
	}

}


/* You should copy all the event handlers below into your app. 
 * It makes sure that when an app is paused, the audio pauses, and when resumed, audio is resumed.
 * Additionally, when Android exits an app, it calls ALmixer_Quit() which is necessary to make sure
 * the audio system is properly cleaned up, or there could be problems on the next launch.
 */
/// @param $.win This variable is required for only Android. It should be you main application window.
Plasticine.setupApplicationLifeCycleHandlers = function(params) {
	var params = params || {};
	var app;
	if(OS_ANDROID)	{
		// For Android, we don't really have a global application reference. 
		// So we use the main game window's activity instead.
		// The window must be opened before we call getActivity()
		// Titanium.Android.currentActivity isn't good because it can change on you.
		app = params.window.getActivity();
	} else {
		app = Titanium.App;
	}

	app.addEventListener('pause', function(){
			Ti.API.info("pause called");
 			Plasticine.Sound.BeginInterruption();
 			params.onPause && params.onPause();
		}
	);
	
	// onuserleavehint was introduced in Ti 3.2.0.GA to better handle Android events.
	// You need 3.2.0.GA for this to have any effect, but it is safe to run this on older versions because it will be a no-op.
	OS_ANDROID && app.addEventListener('onuserleavehint', function() {
			Ti.API.info("onuserleavehint called");
 			Plasticine.Sound.BeginInterruption();
		}
	);

	// I think this is triggered when resuming Titanium phone call interruptions.	
	app.addEventListener('resume', function() {
			Ti.API.info("resume called");
			Plasticine.Sound.EndInterruption();
		}
	);

	// I think this is triggered for resuming all other paused events.
	app.addEventListener('resumed', function() {
			Ti.API.info("resumed called");
			Plasticine.Sound.EndInterruption();
			params.onResume && params.onResume();
		}
	);
}

module.exports = Plasticine;
