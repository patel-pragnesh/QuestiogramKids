/*
 * UTILS
 */

// Percentage to dec conversor:

exports.percentageToDec = function(value){

  	var num = parseFloat(value);

    var max = Alloy.CFG.screenHeight;

    var d = (num*max)/100;

    return d;

};

// Check if a string contains json chars at the end

exports.isLayoutLoadedFromMap = function(map){

	if(typeof map == 'string'){

		var spl = map.split(".");
			
		if(_.last(spl) === 'json'){

			Ti.API.info('Menu will loaded from a tiled map');

			return true;

		};
	};

};

// Return buttons from template:

exports.getButtonsFromTemplate = function(layout){

	var requestedLayout = [];

	if(_.isArray(layout)){

		Ti.API.info ('Automatic menu, option selected: Custom Array');

		requestedLayout = layout;

	}else{

		switch (layout){

			case 'main' : 

				Ti.API.info ('Automatic menu, option selected: Main');

				requestedLayout = ['play','ranking','rate','store','share','soundOff'];

			break;

			case 'result' : 

				Ti.API.info ('Automatic menu, option selected: Result');

				requestedLayout = ['ranking','rate','share','repeat','home'];

			break;

			case 'all' : 

				Ti.API.info ('Automatic menu, option selected: All');

				requestedLayout = ['play','ranking','store','rate','share','soundOff','repeat','home'];

			break;

			default:

				Ti.API.info('Error loading buttons. Check type property on menu widget creation');
			
		};
	};

	return requestedLayout;

};
