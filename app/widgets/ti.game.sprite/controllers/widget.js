var args = cleanArgs(arguments[0] || {});

var platino = require('io.platino');
var sprite = $.sprite;

Ti.API.info('ti.game.sprite');

init();

function init(e){

	//Alloy.Globals.gameView.setupSpriteSize(sprite);
	for(var k in args){
		if(k !== 'children') sprite[k] = args[k];
	}

	if(args.children) drawChildren(args.children);

}


//adds children as child node
function drawChildren(children){

	//remove other platforms views if they exist
	for(var i = 0, j = children.length; i < j; i++){

		// fix: https://jira.appcelerator.org/browse/TC-3583 (thx, fokke!)
		if (!children[i]) {
			continue;
		}

		Ti.API.info('Adding childNode "' + i + '" + name: ' + children[i].name);

		//is it a widget or a native sprite?
		sprite.addChildNode(children[i]);
	}
}

$.drawChildren = drawChildren;

function cleanArgs(args){
	// delete irrelevant args
	delete args.id;
	delete args.__parentSymbol;
	//delete args.children;

	return args;
};