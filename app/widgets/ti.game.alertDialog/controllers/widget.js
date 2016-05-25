var args = arguments[0] || {};

var parent = args.parent;

$.init = function (arg) {

};

// The show method accepts two types of messages. A single alertview with a string as argument or a complex message with an object as an argument.

function show(payload){

	// Message with payload === object. (Alert dialog)

	if(_.isObject(payload)) {

		var payload = payload || {};

		$.textTitle.text = payload.title || Ti.App.getName();
		$.message.text = payload.message || '';

		if (payload.options === undefined || payload.options.length === 1) {
			
			// If options are not defined, the alert will show just one option (ok):
			createSingleButton(payload.onOkClick);
			
		} else {
			
			// If options contains 'ok' and 'cancel' it will create a button bar:
			createTwoButtons(payload.onOkClick, payload.onCancelClick);
		
		};

		$.win.open();

	// Message with payload === string or number. (Simple Alert view)

	} else if (_.isString(payload) || _.isNumber(payload)) {

		$.textTitle.text = Ti.App.getName();
		$.message.text = payload || '';

		// Create single button:
		createSingleButton();

		$.win.open();

	} else {

		Ti.API.info('Custom Alert. Wrong parameters');

	};


};

// Create a single OK Button

function createSingleButton(callback){

	var btnStyle = $.createStyle({
		classes: ['singleButton', 'ok'],
		width : Ti.UI.FILL,
		left:5,
		right:5,
		title: L('ok'),
		apiName: 'Button'
	});

	$.okButton = $.UI.create('Button', btnStyle);
	$.buttonBox.add($.okButton);

	// Add listeners:
	$.okButton.addEventListener('click',function(e){

		if(callback){
			callback();
		};
		$.win.close();
	});


};

// Create two buttons (ok and cancel):

function createTwoButtons(okCallback, cancelCallback){

	$.buttonBox.layout = "horizontal" ;

	var dpi = (OS_ANDROID) ? (160/Ti.Platform.displayCaps.dpi) : 1;

	var widthView = (Ti.Platform.displayCaps.platformWidth)*dpi - $.alertBox.left*2;

	// Create ok and cancel button styles:

	var cancelStyle = $.createStyle({
        classes: ['singleButton', 'cancel'],
        title: L('cancel'),
        width:widthView*0.5 - 10,
        left:5,
        right:5,
        apiName: 'Button'
    });

	var okStyle = $.createStyle({
        classes: ['singleButton', 'ok'],
        title: L('ok'),
        width:widthView*0.5 - 10,
        left:5,
        right:5,
        apiName: 'Button'
    });

	// Apply styles
	$.okButton = $.UI.create('Button', okStyle);
	$.cancelButton = $.UI.create('Button', cancelStyle);
	
	// Add to buttonBox bar
	$.buttonBox.add($.cancelButton);
	$.buttonBox.add($.okButton);

	// Add listeners:
	$.okButton.addEventListener('click',function(e){

		if(okCallback){
			okCallback();
		};
		$.win.close();
	});

	$.cancelButton.addEventListener('click',function(e){

		if(cancelCallback){
			cancelCallback();
		};
		$.win.close();
	});

};

exports.show = show;

