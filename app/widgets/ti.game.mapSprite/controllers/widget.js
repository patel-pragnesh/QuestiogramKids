/**
* args must contain "file" property pointing to a json file
*
*/
var args = cleanArgs(arguments[0] || {});

var platino = require('io.platino');


Ti.API.info('ti.game.mapSprite');

function initMap(){

	if(args.file){
		var mapfile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, args.file);  
		var mapjson = JSON.parse(mapfile.read().text);
		var layerIndex = args.layer || 0;
		var layers = mapjson.layers; 

		/* DRAW MAP TILES */

		var mapinfo = {
		    image:"maps/" + mapjson.tilesets[layerIndex].image,
		    tileWidth:mapjson.tilesets[layerIndex].tilewidth,
		    tileHeight:mapjson.tilesets[layerIndex].tileheight,
		    border:mapjson.tilesets[layerIndex].spacing,
		    margin:mapjson.tilesets[layerIndex].margin
		};

		for(var k in mapinfo){
			$.map[k] = mapinfo[k];
		}
		$.map.firstgid = mapjson.tilesets[layerIndex].firstgid; // tilemap id is started from 'firstgid'
		$.map.tiles = mapjson.layers[layerIndex].data;
		//map.orientation = platino.MAP_ISOMETRIC;
		$.map.mapSize = {width:mapjson.layers[0].width, height:mapjson.layers[0].height};
		//map.tileTiltFactorY = mapjson.tileheight * 0.5 / mapjson.tilesets[0].tileheight;

	}

	for(var k in args){
		$.map[k] = args[k];
	}
}

initMap();

function cleanArgs(args){
	// delete irrelevant args
	delete args.id;
	delete args.__parentSymbol;
	delete args.children;
	
	return args;
};



