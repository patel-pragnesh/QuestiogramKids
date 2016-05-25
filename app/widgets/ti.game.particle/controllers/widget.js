var args = cleanArgs(arguments[0] || {});

var platino = require('io.platino');

Ti.API.info('ti.game.particle');

var particle = $.particle;

for(var k in args){
	particle[k] = args[k];
}


function cleanArgs(args){
	// delete irrelevant args
	delete args.id;
	delete args.__parentSymbol;
	delete args.children;
	
	return args;
};