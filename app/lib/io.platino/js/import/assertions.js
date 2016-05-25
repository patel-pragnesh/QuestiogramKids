/**
 * Tests and assertions for the Platino Loader
 */
module.exports = {
	assert: function(condition, error) {
		if(!condition) throw new Error("SpriteLoader: " + error);	
	},
	require_attribute: function(obj, attribute) {
		this.assert(obj[attribute], "The attribute '" + attribute + "' was not provided.");
	},
	check_map_format: function(map) {
		this.require_attribute(map, 'tilesize');
		this.require_attribute(map, 'layers');
		this.require_attribute(map, 'legend');
		this.assert(map.layers instanceof Array, "'layers' attribute should be an array.");
		this.assert(map.legend.constructor == Object, "'legend' attribute should be a dictionary.");
		this.assert(map.tilesize instanceof Array, "Malformed tilesize. Array of width/height required.");
		this.assert(map.tilesize.length == 2, "Malformed tilesize. Array of width/height required.");
		if(map.offset) {
			this.assert(map.offset instanceof Array, "Malformed offset. Array of x/y required.");
			this.assert(map.offset.length == 3, "Malformed offset. Array of x/y/z required.");
		}
	}
};
