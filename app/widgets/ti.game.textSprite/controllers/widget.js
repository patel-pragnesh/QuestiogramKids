var args = cleanArgs(arguments[0] || {});

var sprite = $.sprite;

$.value = 0;

Ti.API.info('ti.game.textSprite');

for(var k in args){
	sprite[k] = args[k];
};

sprite.up = function(ud) {
	$.value += ud;
	sprite.text = $.value;
};

// Down score
sprite.down = function(ud) {
	if(ud > $.value) {
		if(args.allowNegativeNumbers) {
			$.value -= ud;
		} else {
			$.value = 0;
		};
	} else {
		$.value -=ud;
	};

	sprite.text = $.value;
};

// Set value
sprite.setText = function(value) {
	sprite.text = $.value = value;
};

// Get value
sprite.getText = function() {
	return $.value || '';
};

// Reset value
sprite.reset = function() {
	$.value = 0; //maybe should be an empty string?
	sprite.text = $.value;
};


function cleanArgs(args){
	// delete irrelevant args
	delete args.id;
	delete args.__parentSymbol;
	delete args.children;
	
	return args;
};
