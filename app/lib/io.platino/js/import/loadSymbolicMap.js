/**
 * Symbolic Map parser for the Platino Loader
 */
var Assertions = require("io.platino/js/import/assertions");
module.exports = function(map) {
	Assertions.check_map_format(map);
		
	var json = {sprites: []};
	
	// Z - Layers
	for(var z = 0; z < map.layers.length; z+=1) {
		var layer = map.layers[z];
		
		// Y - Rows
		for(var y = 0; y < layer.map.length; y+=1) {
			var row_data = layer.map[y];
			
			// X - Columns
			var x = 0;
			for(var char_index = 0; char_index < row_data.length; char_index+=1) {
				var tile = row_data[char_index];
				
				// Spaces ignored for nice formatting
				if(tile != ' ') {
					var legend = map.legend[tile];
					if(legend) {
						// Although we stringify, we can't do that to the controller as it contains functions
						var sprite_properties = JSON.parse(JSON.stringify(legend));
						sprite_properties.controller = legend.controller;
						
						// Calculate the position of the upper left corner of the sprite
						sprite_properties.data.x = map.tilesize[0] * x;
						sprite_properties.data.y = map.tilesize[1] * y;
						sprite_properties.data.x += map.offset ? map.offset[0] : 0;
						sprite_properties.data.y += map.offset ? map.offset[1] : 0;
						sprite_properties.data.z = z + map.offset ? map.offset[2] : 0;

						// If this particular sprite has a user-defined identifier, add to its legend
						if(layer.ids) {
							Object.keys(layer.ids).forEach(function(key) {
								coords = map.layers[z].ids[key];
								if((coords[0] == x) && (coords[1] == y)) {
									sprite_properties.id = key;
								}
							});
						}
						
						json.sprites.push(sprite_properties);
					}
					x += 1;
				}
			}
		}
	}
	
	return this.fromJSON(json);
};
