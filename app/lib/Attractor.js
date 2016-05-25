
var sqrt = Math.sqrt;
var pow = Math.pow;

// Positions in the boids array. Do not change!!
var POSITIONX = 0
	, POSITIONY = 1
	, SPEEDX = 2
	, SPEEDY = 3
	, ACCELERATIONX = 4
	, ACCELERATIONY = 5
	, SHOULD_MOVE = 6;


var cpY = function(y) {
	return (Alloy.CFG.screenHeight - y);
};

module.exports = function (opts, callback) {
	var opts = opts || {}
	var callback = callback || function(){};
	var BoidGroup = {};

	var sprites = opts.sprites || [];
	var boids = [];

	for (var i = 0, l = sprites.length; i < l; i++) {
		boids[i] = [
			sprites[i].x, // x
			sprites[i].y, // y
			10, 10,  // speed
			10, 10,  // acceleration,
			false	//should move
		];
	}

	BoidGroup.boids = boids;

	var sepDist = Math.pow(opts.separationDistance || 60, 2);
	var sepForce = opts.separationForce || 0.15;
	var cohDist = Math.pow(opts.cohesionDistance || 180, 2);
	var cohForce = opts.cohesionForce || 0.1;
	var aliDist = Math.pow(opts.alignmentDistance || 180, 2);
	var aliForce = opts.alignmentForce || opts.alignment || 0.25;
	var speedLimitRoot = opts.speedLimit || 0;
	var speedLimit = Math.pow(speedLimitRoot, 2);
	var accelerationLimitRoot = opts.accelerationLimit || 1;
	var accelerationLimit = Math.pow(accelerationLimitRoot, 2);
	var attractors = opts.attractors || [];
	var attractorCount = attractors.length;

	BoidGroup.setCoordinates = function(_attractors){
		console.log('setCoordinates')
		attractors = _attractors || [];
		attractorCount = attractors.length;
	};
	
	BoidGroup.setMovementForIndex = function(index, value){
		boids[index][SHOULD_MOVE] = value;
	};

	BoidGroup.addElement = function(element) {
		boids.push([
			element.x, // x
			element.y, // y
			10, 10,  // speed
			10, 10,  // acceleration,
			true	//should move
		]);
		size = boids.length;
	}

	var size = boids.length;
	var sforceX, sforceY
		, cforceX, cforceY
		, aforceX, aforceY
		, spareX, spareY
		, distSquared
		, currPos
		, targPos
		, length
		, target
		, currentBoid;
			
	BoidGroup.tick = function() {
		
		current = size;
		
		while (current--) {

			currPos = boids[current];

			if (!currPos[SHOULD_MOVE]) continue;

			sforceX = sforceY = cforceX = cforceY =	aforceX = aforceY = 0;
			
			// Attractors
			target = attractorCount
			while (target--) {
				attractor = attractors[target]
				spareX = currPos[POSITIONX] - attractor[POSITIONX]
				spareY = currPos[POSITIONY] - attractor[POSITIONY]
				distSquared = spareX * spareX + spareY * spareY;

				if(!distSquared) continue;
				if (distSquared > attractor[2] * attractor[2] ) {
					length = sqrt(distSquared);
					currPos[SPEEDX] -= (attractor[3] * spareX / length) || 0
					currPos[SPEEDY] -= (attractor[3] * spareY / length) || 0
				}
			}

			target = size;

			while (target--) {
				if (target === current) continue;
					
				spareX = currPos[0] - boids[target][0]
				spareY = currPos[1] - boids[target][1]
				distSquared = spareX*spareX + spareY*spareY

				if (distSquared < sepDist) {
					sforceX += spareX
					sforceY += spareY
				} else {
					if (distSquared < cohDist) {
						cforceX += spareX
						cforceY += spareY
					}
					if (distSquared < aliDist) {
						aforceX += boids[target][SPEEDX]
						aforceY += boids[target][SPEEDY]
					}
				}
			}
			
			// Separation
			length = sqrt(sforceX*sforceX + sforceY*sforceY)
			currPos[ACCELERATIONX] += (sepForce * sforceX / length) || 0
			currPos[ACCELERATIONY] += (sepForce * sforceY / length) || 0
			// Cohesion
			length = sqrt(cforceX*cforceX + cforceY*cforceY)
			currPos[ACCELERATIONX] -= (cohForce * cforceX / length) || 0
			currPos[ACCELERATIONY] -= (cohForce * cforceY / length) || 0
			// Alignment
			length = sqrt(aforceX*aforceX + aforceY*aforceY)
			currPos[ACCELERATIONX] -= (aliForce * aforceX / length) || 0
			currPos[ACCELERATIONY] -= (aliForce * aforceY / length) || 0
		}
		
		current = size

		// Apply speed/acceleration for
		// this tick
		while (current--) {

			currPos = boids[current];
			if (!currPos[SHOULD_MOVE]) continue;

			if (accelerationLimit) {
				distSquared = currPos[ACCELERATIONX]*currPos[ACCELERATIONX] + currPos[ACCELERATIONY]*currPos[ACCELERATIONY]
				if (distSquared > accelerationLimit) {
					ratio = accelerationLimitRoot / sqrt(distSquared)
					currPos[ACCELERATIONX] *= ratio
					currPos[ACCELERATIONY] *= ratio
				}
			}

			currPos[SPEEDX] += currPos[ACCELERATIONX]
			currPos[SPEEDY] += currPos[ACCELERATIONY]

			if (speedLimit) {
				distSquared = currPos[SPEEDX]*currPos[SPEEDX] + currPos[SPEEDY]*currPos[SPEEDY]
				if (distSquared > speedLimit) {
					ratio = speedLimitRoot / sqrt(distSquared)
					currPos[SPEEDX] *= ratio
					currPos[SPEEDY] *= ratio
				}
			}

			currPos[POSITIONX] += currPos[SPEEDX]
			currPos[POSITIONY] += currPos[SPEEDY]
		}

	}

	return BoidGroup;
}

	
