
var playerProgress = {};
		
function init(){

	if(Ti.App.Properties.getString('playerProgress')){
		
		playerProgress = JSON.parse(Ti.App.Properties.getString('playerProgress'));
		Ti.API.info(playerProgress);
		
	}else{
		
		Ti.API.info('First time playing. Creating User Properties.');
		
		_.defaults(playerProgress,Alloy.CFG.userSettings);
		
		Ti.App.Properties.setString('playerProgress', JSON.stringify(playerProgress));
	
	};

};

exports.getGameProgressJSONFile = function(e){

	if(e.newUser){

		var newDataProgress = {};

		_.defaults(newDataProgress,Alloy.CFG.userSettings);

		return JSON.stringify(newDataProgress);


	}else{


	};

};

exports.overwritePlayerProgress = function(newData){

	playerProgress = newData;

	Ti.App.Properties.setString('playerProgress', JSON.stringify(newData));

};

function getData(src){
	
	var playerProgressObj = JSON.parse(Ti.App.Properties.getString('playerProgress'));
	var data = JSON.parse(playerProgressObj[src]);
	return data;
};

function setData(src,value){
	
	playerProgress[src] = value; 
	
};

function setAndSavePersistentData(src,value){
	
	playerProgress[src] = value; 
	Ti.App.Properties.setString('playerProgress', JSON.stringify(playerProgress));
};

function discountFromCurrentMoney(qty){
	
	var diff = parseInt(playerProgress.currentMoney) - parseInt(qty);
	setAndSavePersistentData('currentMoney',diff);
	
};

function increaseAmountOfMoney(qty){

	var diff = parseInt(playerProgress.currentMoney) + parseInt(qty);

	setAndSavePersistentData('currentMoney',diff);
	
};

function checkCost(qty){
	
	var isEnoughMoney = false;
	
	(parseInt(qty) < parseInt(playerProgress.currentMoney)) ? isEnoughMoney = true : isEnoughMoney = false;
	
	return isEnoughMoney;
	
};

exports.getPlayerProgress = function(){
	return playerProgress;
};	

exports.submitScore = function(newScore) {
	var bestResult = parseInt(playerProgress.maxScore);
	if(newScore > bestResult){
		setAndSavePersistentData('maxScore',newScore);
		return true;
	};
};


exports.init = init;
exports.getData = getData;
exports.setData = setData;
exports.discountFromCurrentMoney = discountFromCurrentMoney;
exports.checkCost = checkCost;
exports.increaseAmountOfMoney = increaseAmountOfMoney;
exports.setAndSavePersistentData = setAndSavePersistentData;
