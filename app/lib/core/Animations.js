var platino = require('io.platino');
var sound = require('core/Sound');
exports.animateButton = function(btn, soundUrl,callback){
	
	var speed = 80;

	// Ensures backward compatibility with previous versions that did not include sound
	if(soundUrl && typeof callback === 'undefined'){
		var action = soundUrl || function(){};
	
	}else if(soundUrl && callback) {
		sound.playFx(soundUrl);
		var action = callback || function(){};
	};

	if(OS_IOS){
		
		var tr = platino.createTransform({
			duration:speed,
			autoreverse:true
		});
		
		tr.scale(0.7,0.7);
		btn.transform(tr);
		
		setTimeout(function() {
			action();
		}, speed*3);
		
		return 'completed';
		
	}else if(OS_ANDROID){
		
		btn.scale(0.7,0.7);
		
		var tr = platino.createTransform({
			duration:speed,
		});
		
		tr.scale(1,1);
			
		btn.transform(tr);
		
		setTimeout(function() {
			action();
		}, speed*1.2);
		
		
	};;
	
};

exports.modifyInitPos = function(type, initPos){

	switch (type){

		case 'none':

			return initPos;

		break;

		case 'upToDown':

			return {x:initPos.x,y:(initPos.y - Alloy.CFG.screenHeight)};

		break;

		case 'leftToRight':

			return {x:(initPos.x - Alloy.CFG.screenWidth),y:initPos.y};;

		break;

		case 'rightToLeft':

			return {x:(initPos.y + Alloy.CFG.screenWidth),y:initPos.y};

		break;

		case 'downToUp':

			return {x:initPos.x, y: (initPos.y + Alloy.CFG.screenHeight)};

		break;

		default:

			return initPos;
	};

};

exports.setEndPostion = function(type, initPos){

	switch (type){

		case 'none':

			return initPos;

		break;

		case 'upToDown':

			return {x:initPos.x, y:(initPos.y + Alloy.CFG.screenHeight)};

		break;

		case 'leftToRight':

			return {x:(initPos.x + Alloy.CFG.screenWidth), y:initPos.y};

		break;

		case 'rightToLeft':

			return {x:(initPos.x - Alloy.CFG.screenWidth), y:initPos.y};

		break;

		case 'downToUp':

			return {x:initPos.x, y:(initPos.y - Alloy.CFG.screenHeight)};

		break;

		default:

			return initPos;
	};

};






