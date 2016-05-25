/* 
 * Menu Widget for Plasticine.
 * Allows you to develop faster menus for games. Available for iOS and Android, without any dependencie.
 * 2015. Alejandro Rayón
 */

var args = arguments[0] || {};
var game = Alloy.Globals.gameView;

/* 
 * Import the necessary modules:
 * utils: Help functions are provided for menu creation. It's in the widget library because it only refers to this component.
 * animation : Useful functions to animate buttons
 */
var platino = require('io.platino');
var utils = require(WPATH('utils'));
var animation = require('core/Animations');

/*
 * Instanciate variables for this widget. 
 * refreshbutton is a button used to reload the menu remotely (Button will only be created if readFromSource = 'remote');
 * relativeY is used to set the y possition of button bar depending on the size of the screen
 * arrayButtons used to keep all the button instances requested in the parent component
*/

var refreshButton = null;
var relativeY = 0;
var arrayButtons = [];

// Default widget properties:

var defaultOptions = {

	animatedOnShow:'none',
	animatedOnHide:'none', 
	tag:'',
	autoShowed:false,
	type: "main", 
	readFromSource: "local",
	destroyOnExit:false,				
	relativeY:'70%',
	z:1

};

/*
 * Init: Function that is executed when widget is called.
 * It is responsible for set all args properties not declared in xml or tss to default values.
 * If args.autoshowed is true, starts creating the menu calling show(), otherwise, this function must be called from the controller. 
 */


function init(){

	_.defaults(args,defaultOptions);

	if(args.autoShowed){
		show();
	};
};

init();

/*
 * Show: Check the type of menu to be displayed (main, result, all, custom array or from a tilemap) and calls the relevant function.
 * It must be called from the controller. 
 * This method can contain properties to configure the widget. If these already exist they will be overwritten.
 */

function show(payload){

	var payload = payload || {};

	// Merge the properties declared in xml or tss with the properties defined in show() method (in controller)
	// if these have been modified.
	
    _.extend(args, payload); 

    // At this point, the current properties are to be finally used. We can do now the conversion of the percentage 'args.relativeY' to a real value in decimal.

    relativeY = utils.percentageToDec(args.relativeY);

    /*
	 * We check if the layout must be readed from a tilemap or no.
	 * 1) First we check if the menu has to read info from a tiled map and call createMenuFromTiledMap();
	 * 2) If we have to read a tilemap, we also check the property readFromSource. If it is "remote", we create the refreshButton and download the map. 
	 * 3) If args.type is not a map, we call createMenuFromAutomaticLayout();
    */

	if(utils.isLayoutLoadedFromMap(args.type)){

		if (args.readFromSource === 'local'){

			createMenuFromTiledMap();

		}else if (args.readFromSource === 'remote'){
			
			createRefreshButton();

			loadMapFromServer();

		};

		Ti.API.info('Loading Tiled Menu');

	}else{

		createMenuFromAutomaticLayout();

		Ti.API.info('Loading Auto Menu');


	};


};

/*
 * createMenuFromAutomaticLayout: 
 * Get the buttons to show depending on if they are a template ('main', 'result', 'all') or a custom array. 
 * Instanciate these buttons and save them in arrayButtons. 
 * This function add buttons to the screen, but still does not show them
 */

function createMenuFromAutomaticLayout(){

	// Check args.type and request the buttons:

	var buttons = utils.getButtonsFromTemplate(args.type);

	/*
	 * The following code is used to display the buttons on the same vertical position (relativeY) and distributed horizontally
	 * Play button is always showed centered on screen
	 */

	var totalButtons = 0;
	var totalWidthButtons = 0;
	var buttonSize = 0;

	_.each(buttons, function(button){

		/*
		 * Iterate the buttons to show and create the sprites using getRequestedSprite();
		 * Keep this references in arrayButtons for later use. 
		 * getRequestedSprite is a function that takes a name string and returns a platino object (sprite) reading its properties from a Tss file
		 */

		var btn = getRequestedSprite(button);

		arrayButtons.push(btn);
		
		if(btn.name != 'play'){

			totalButtons++;
			totalWidthButtons += btn.width;

		};
		

	});

	// If the buttons do not fit on the screen this code will scale them (very useful for args.type === 'all');

	var scale = 1;

	if(totalWidthButtons > game.screen.width){

		scale = game.screen.width / totalWidthButtons;

		_.each(arrayButtons, function(button){
			if(button.name != 'play'){
				button.scale(scale);
			};
		});

		totalWidthButtons *= scale;

	};

	
	buttonSize = (totalWidthButtons/totalButtons);

	var initPosX = ((game.screen.width - totalWidthButtons)*0.5 + buttonSize*0.5)*scale;
	var initPosY = relativeY;

	// We have the calculated positions, we now add objects to the screen:

	var inc = 0;

	_.each(arrayButtons, function(button,i){
	
			if(button.name != 'play'){
			
				button.center = {x:initPosX + buttonSize*inc, y: initPosY};
				inc++;
			
			}else{
	
				button.center = {x:game.screen.width * 0.5, y: game.screen.height * 0.5};
				
			};

			// Check if the menu should be animated, in that case, we move the positions of the objects:

			button.center = animation.modifyInitPos(args.animatedOnShow,button.center);
	
  			game.addHUD(button);
				
	});

	// Now we can show the buttons. We do it by this way (in two steps) to avoid flickering in sprite
	// creation and it gives us the opportunity to move them before start the animation!

	showButtonsOnScreen();

	
	
};

/*
 * createMenuFromTiledMap: 
 * Get the buttons to show reading a TileMap.
 * Instanciate these buttons and save them in arrayButtons. 
 * This function can be reached in two ways, from show() or from loadMapFromServer()
 * This function add buttons to the screen, but still does not show them
 */


function createMenuFromTiledMap(map){

		// If map exists, the map is read remotely, otherwise it is stored in filesystem:

		if(!map){

			var nameFile = 'maps/'+args.type;
			var file = JSON.parse(Ti.Filesystem.getFile(nameFile).read());

		}else{

			var nameFile = map;
			var tempFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,nameFile);
			var file = JSON.parse(tempFile.read());
			

		};

		// Calculate parameters to adjust positions depending on the size of each screen

		var heightFile = file.tileheight*file.height;
		var widthFile = file.tilewidth*file.width;
	
		var scale = {
			x : game.screen.width / widthFile,
			y : game.screen.height / heightFile
		};
	
		/*
		 * Iterate the buttons to show and create the sprites using getRequestedSprite();
		 * Keep this references in arrayButtons for later use. 
		 * The object without buttonRequested.visible won´t be rendered. 
		 * getRequestedSprite is a function that takes a name string and returns a platino object (sprite) reading its properties from a Tss file
		 */
		 

		_.each(file.layers[0].objects, function(buttonRequested){

				if(buttonRequested.visible){

					var button = getRequestedSprite(buttonRequested.name);
	
					button.center = {
						x:buttonRequested.x*scale.x + button.width*0.5*scale.x,
						y:buttonRequested.y*scale.y + button.height*0.5*scale.y
					};
					
					arrayButtons.push(button);

					// Check if the menu should be animated, in that case, we move the positions of the objects:

					button.center = animation.modifyInitPos(args.animatedOnShow,button.center);


					game.addHUD(button);
				
				};

		});	

	// Now we can show the buttons. We do it by this way (in two steps) to avoid flickering in sprite
	// creation and it gives us the opportunity to move them before start the animation!

	showButtonsOnScreen(); 		
	
};


/*
 * showButtonsOnScreen(): 
 * Show the buttons from both options (automatic menu or tilemap)
 * Check if the buttons have to receive any transform.
 * Set button.alpha to true;
 */

function showButtonsOnScreen(){

	// Transform timings:

	var timeDelay = 100;
	var timeTransform = 1000;
	var timeOutTransform = timeTransform;

	_.each(arrayButtons, function(button,i){

		button.alpha = 1;

		if(args.animatedOnShow != 'none'){	

			// We create a local transform to prevent the garbage collector

			var delay = timeDelay + timeDelay*i;
			var finalPos = animation.setEndPostion(args.animatedOnShow,button.center);
			var tr = platino.createTransform({duration:timeTransform, easing:platino.ANIMATION_CURVE_EASE_IN,delay:delay, x:finalPos.x - button.width*0.5, y:finalPos.y - button.height*0.5});
			button.transform(tr);

			// Calculate total time of transform to fire the trigger at the end. 
			// It should do it with a complete listener, but Android has problems with it

			timeOutTransform +=timeDelay;
		};	
				
	});

	// Delay of settimeout :

	var timeOut = (args.animatedOnShow === 'none') ? 0 : timeOutTransform;


	setTimeout(function(){

		// Add button listeners:

		game.addEventListener('touchstart', onTouchStartButtons);

		// Fire onMenuShow event:

		$.trigger('menuShow');

	}, timeOut);

};



function hide(payload){

	// First of all, we remove the listeners to avoid 'doubleclicks'

	game.removeEventListener('touchstart', onTouchStartButtons);

	var payload = payload || {};


	// Transform timings:

	var timeDelay = 100;
	var timeTransform = 1000;
	var timeOutTransform = timeTransform;

	// Iterate buttons to show and animate the menu: 

	_.each(arrayButtons, function(button,i){

		if(args.animatedOnHide != 'none'){	

			var delay = timeDelay + timeDelay*i;
			var finalPos = animation.setEndPostion(args.animatedOnHide,button.center);
			var tr = platino.createTransform({duration:timeTransform, easing:platino.ANIMATION_CURVE_EASE_IN, delay:delay, x:finalPos.x - button.width*0.5, y:finalPos.y - button.height*0.5});

			button.transform(tr);

			// Calculate total time of transform to fire the trigger at the end. 
			// It should do it with a complete listener, but Android has problems with it

			timeOutTransform +=timeDelay;
		};	
				
	});

	// Delay of settimeout :

	var timeOut = (args.animatedOnHide === 'none') ? 0 : timeOutTransform;

	// Remove and delete all instances:

	setTimeout(function(){

		_.each(arrayButtons, function(button){
	
			game.removeHUD(button);
			button.dispose();
			button = null;
  			
	
		});

		arrayButtons.length = 0;

		// Fire onMenuRemove event returning properties to handle the widget in parent

		_.defaults(payload, args);

		$.trigger('menuRemove',payload);

	}, timeOut);

};


/*
 * loadMapFromServer() BETA!!
 * Load a map from server
 */

function loadMapFromServer(){

	var xhr = Titanium.Network.createHTTPClient({

	    onload: function(e) {
	     
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'myMap.json');
			f.write(this.responseData);

			createMenuFromTiledMap('myMap.json');

	    },

	    onerror:function(e){
	    	alert('Problem loading map. '+e.error);

	    },

	    timeout: 5000
	
	});

	xhr.open('GET',Alloy.CFG.urls.jsonMaps+args.type);	
	xhr.send();

};

/*
 * getRequestedSprite()
 * Iterate requested buttons assigning the style declared in TSS
 * By this way, we can use dynamic styles without having declared the objects in XML file
 */

 // TODO: Check if is better pass this function to utils. 
 // TODO: Check if auto style is not working because config.son

function getRequestedSprite(name){

	var platinoObj = Alloy.createWidget("ti.game.spriteSheet").getView();

	var style = $.createStyle({classes:['menuBtn',name],apiName: 'ti.game.spriteSheet'});

	_.extend(platinoObj, style); //Dinamyc style : platinoObj.applyProperties(style), not working

	platinoObj.selectFrame(style.selectedFrame);

	platinoObj.anchorPoint = {x:0.5,y:0.5};

	platinoObj.z = args.z;

	platinoObj.alpha = 0;

	return platinoObj;
};

/*
 * LISTENERS
 */

function onTouchStartButtons(e){

    _.each(arrayButtons, function(button){
    	
    	if(button.contains(e.x * game.touchScaleX, e.y * game.touchScaleY)){

    		$.trigger('touchstart', button);
    	
    	};
    	
    });
    
};

function onTouchStartRefreshButton(e){

	// FOR REMOTE MAP. BETA!!
	
	if(refreshButton.contains(e.x * game.touchScaleX, e.y * game.touchScaleY)){
	
		hide();

		setTimeout(function () { 
	        loadMapFromServer();
	    }, 800);	
		
	};

};

// Button to refresh remote map. BETA!!

function createRefreshButton(){

	if(refreshButton === null){
	

		refreshButton = getRequestedSprite('repeat');
		refreshButton.show();
		refreshButton.x = game.screen.width - refreshButton.width;
		refreshButton.y = 100;
		refreshButton.color(1,0,1);

		game.addHUD(refreshButton);

		game.addEventListener('touchstart', onTouchStartRefreshButton);
	};

};

exports.removeRefreshButton = function(){

		game.removeEventListener('touchstart', onTouchStartRefreshButton);

		game.removeHUD(refreshButton);
		refreshButton.dispose();
		refreshButton = null;

};

/*
 * EXPORTS
 */

exports.show = show;
exports.hide = hide;

exports.getButton = function(name){
	_.each(arrayButtons, function(btn){
		Ti.API.info('Desired: '+name+', looking for:'+btn.name);
		if (name === btn.name){
			Ti.API.info('MATCH');
			return btn;
		};
	});
};


