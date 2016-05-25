var args = arguments[0]||{};

// Scale ratios between Ti and Platino:
var sX = Alloy.Globals.gameView.tiScaleX;
var sY = Alloy.Globals.gameView.tiScaleY;

// Conversion between Platino and Titanium coordinates:
args.left= args.x*sX || 0;
args.top= args.y*sY || 0;
args.width= args.width*sX || Ti.UI.FILL;
args.height= args.height*sY || 200;
args.font = {
	fontSize: args.fontSize*sY, 
	fontFamily:Alloy.CFG.fonts.boldFont.fontFamily
};

// Apply properties to label:
$.label.applyProperties(args);

// Internal counter:
$.value = 0;

// Public methods:
$.label.up = function(ud) {
	$.value += ud;
	$.label.text = $.value;
};

// Down score
$.label.down = function(ud) {
	if(ud > $.value) {
		if(args.allowNegativeNumbers) {
			$.value -= ud;
		} else {
			$.value = 0;
		};
	} else {
		$.value -=ud;
	};

	$.label.text = $.value;
};

// Set value
$.label.setText = function(value) {
	$.label.text = $.value = value;
};

// Get value
$.label.getText = function() {
	return $.value || '';
};

// Reset value
$.label.reset = function() {
	$.value = 0; //maybe should be an empty string?
	$.label.text = $.value;
};
