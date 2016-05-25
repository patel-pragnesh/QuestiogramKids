var args = arguments[0] || {};

var platino = require('io.platino');
var ALmixer = platino.require('co.lanica.almixer');

// Flag to know if the scene is already created:
$.isOpened = false;

// init: Used every time scene is actived:
function activate(e) {
	Ti.API.info('ti.game.scene: Activate scene');	
	if (!$.isOpened) {
		create();
		$.isOpened = true;
	};
	$.trigger('activated', e);
}

// create: Used first time scene is loaded:
function create() {
	Ti.API.info('ti.game.scene: Create scene');
	drawChildren(args.children);
	$.trigger('created');
}

//tries to add any children in the xml to the scene
function drawChildren(children){

	var views = [];

	if (!children || children.length === 0) {
		return;
	}

	$.scene.beginSpriteAdd();
	$.scene.beginSpriteSort();

	//remove other platforms views if they exist
	for(var i = 0, j = children.length; i < j; i++){

		// fix: https://jira.appcelerator.org/browse/TC-3583 (thx, fokke!)
		if (!children[i]) {
			continue;
		}

		Ti.API.info('Adding children "' + i + '" + name: ' + children[i].name);

		//views.push(children[i]);
		//$.view.add(children[i]);		//we need to draw before positione it to know its real width
		$.scene.add(children[i]);

	}
	$.scene.commitSpriteAdd();
	$.scene.commitSpriteSort();

}
$.drawChildren = drawChildren;