/**
 * Direct JSON parser for the Platino Loader
 */
module.exports = function() {
	return function(json) {
		// Basic results structure
		var results = {
			objects: { 
				value: [], 
				writeable: false, 
				enumerable: true 
			},
			
			addToScene: {
				value: function(object, scene) {
					this.objects.forEach(function(my_object) {
						if(my_object === object) {
							scene.add(object.sprite);
							if(object.onAddToScene) {
								object.onAddToScene(scene);
							}
						}
					});
				},
				writeable:false
			},
			
			removeFromScene: {
				value: function(object, scene) {
					this.objects.forEach(function(my_object) {
						if(my_object === object) {
							scene.remove(object.sprite);
							if(object.onRemoveFromScene) {
								object.onRemoveFromScene(scene);
							}
						}
					});
					
				},
				writeable:false
			},
			
			
			addAllToScene: {
				value: function(scene) {
					this.objects.forEach(function(object) {
						scene.add(object.sprite);
						if(object.controller.onAddToScene) {
							object.controller.onAddToScene(scene);
						}
					});
				},
				writeable: false
			},
			
			removeReference: { 
				value: function(object) {
					for (var i = 0; i < this.objects.length; i++) {
					    if (this.objects[i] === object) { 
					        this.objects.splice(i, 1);
							if(object.onRemoveReference) {
								object.onRemoveReference();
							}   
					    }
					}
				},
				writeable:false
			}
		};
		
		json.sprites.forEach(function(sprite_properties) {
			var sprite = Platino.createSprite(sprite_properties.data);
			
			var controller;
			var data = {
				objectData: {
					value: {
						id: sprite_properties.id,
						group: sprite_properties.group,
						sprite: sprite
					}
				}
			};
			if(sprite_properties.controller) {
				controller = Object.create(sprite_properties.controller, data);
			} else {
				controller = Object.create(null, data);
			}
	
			if(controller.initialize) {
				controller.initialize();
			}
			results.objects.value.push({
				controller: controller,
				sprite: sprite
			});
			
			// Allow lookup by id
			// NOTE: Look up is done so that the groups and ids are nullified if the controller is removed from the objects array
			if(sprite_properties.id) {
				results[sprite_properties.id] = {
					get: function(){
						var o = undefined;
						for(var i = 0; i < this.objects.length; i++) {
							if(this.objects[i].controller.objectData.id == sprite_properties.id) {
								o = this.objects[i].sprite;
							}
						}
						return o;
					},
					writeable: false
				};
			}
			
			// Allow lookup by group
			if(sprite_properties.group) {
				results[sprite_properties.group] = {
					get: function(){
						var o = [];
						for(var i = 0; i < this.objects.length; i++) {
							if(this.objects[i].controller.objectData.group == sprite_properties.group) {
								o.push(this.objects[i].sprite);
							}
						}
						return o;
					},
					writeable: false
				};
			}
		});
		
		return Object.create(null, results);
	};
};
