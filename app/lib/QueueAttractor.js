
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

	var sepDist = Math.pow(opts.separationDistance || 25, 2);
	var sepForce = opts.separationForce || 0.15;
	var cohDist = Math.pow(opts.cohesionDistance || 90, 2);
	var cohForce = opts.cohesionForce || 0.1;
	var aliDist = Math.pow(opts.alignmentDistance || 0, 2);
	var aliForce = opts.alignmentForce || opts.alignment || 0.25;
	var speedLimitRoot = opts.speedLimit || 0;
	var speedLimit = Math.pow(speedLimitRoot, 2);
	var accelerationLimitRoot = opts.accelerationLimit || 1;
	var accelerationLimit = Math.pow(accelerationLimitRoot, 2);
	var queueAttractor = opts.attractor || [];
	var lastPositions = [];

	BoidGroup.setCoordinates = function(_attractor){
		console.log('setCoordinates')
		queueAttractor = _attractor || [];
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

	BoidGroup.splitQueueAt = function(index) {
		boids = boids.slice(0, index);
		size = boids.length;
	}

	var size = boids.length;
	var sforceX, sforceY
		, cforceX, cforceY
		, aforceX, aforceY
		, spareX, spareY
		, distSquared
		, currPos
		, nextPos
		, targPos
		, length
		, target
		, currentBoid;
	
	var ticking = false;

	BoidGroup.tick = function() {
		
		if (ticking) {
			console.log('ticking');
			return false;
		}

		ticking = true;
		current = 0;
		
		// Find the x and y speed for the first element (leader in the queue) and next elements
		for (current = 0; current < size; current++){
			currPos = boids[current];

			sforceX = sforceY = cforceX = cforceY =	aforceX = aforceY = 0;
			
			// Attractors
			if (current === 0) {
				attractor = queueAttractor;
			} else {
				nextPos = boids[current - 1];
				attractor = [
			        nextPos[POSITIONX], // x
			        nextPos[POSITIONY], // y
			        50, // dist
			        1 // spd
			    ];
			}

			spareX = currPos[POSITIONX] - attractor[POSITIONX]
			spareY = currPos[POSITIONY] - attractor[POSITIONY]
			distSquared = spareX * spareX + spareY * spareY;

			if (distSquared > attractor[2] * attractor[2] ) {
				length = sqrt(distSquared);
				currPos[SPEEDX] -= (attractor[3] * spareX / length) || 0
				currPos[SPEEDY] -= (attractor[3] * spareY / length) || 0
				//currPos[SPEEDX] -= (attractor[3] * spareX / length) || 0
				//currPos[SPEEDY] -= (attractor[3] * spareY / length) || 0
			} else {
				currPos[SPEEDX] = 0;
				currPos[SPEEDY] = 0;
			}

			if(current > 0) {
				spareX = currPos[POSITIONX] - nextPos[POSITIONX]
				spareY = currPos[POSITIONY] - nextPos[POSITIONY]
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
						aforceX += nextPos[SPEEDX]
						aforceY += nextPos[SPEEDY]
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
		
		current = size;

		// Apply speed/acceleration for
		// this tick
		while (current--) {
			currPos = boids[current];

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

			currPos[POSITIONX] += currPos[SPEEDX];
			currPos[POSITIONY] += currPos[SPEEDY];
		}
		ticking = false;
		return true;
	}
	return BoidGroup;
}

	
