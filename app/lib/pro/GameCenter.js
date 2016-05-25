
var iCloud = require('pro/Arrow');
var gP = require('pro/GameProgress');

if(OS_IOS){
	var gameKit = require('com.obigola.gamekit');
};

// TODO: MAKE COMMENTS!!!

exports.initGC = function(){
	
	// USER STARTS GAME CENTER LOGIN

	gameKit.initGameCenter({
			
		// User has logged. 
			
		success: function() {

			var player = gameKit.getPlayerInfo();
			player = JSON.parse(player);

			// Overwrite user properties on local database:

			gP.setAndSavePersistentData('id',player.id);
			gP.setAndSavePersistentData('userName',player.alias);
		
			// Checking if is new user in our Arrow database:

			iCloud.logInUserFromGameCenter(player, function(e){

				if (e.success) {	

					//User exists, getting info from Arrow

					alert('Your user already exists in Arrow. We are collecting your information');

					Ti.API.info('Game center user logged in');

					iCloud.retrieveDataProgressForGameCenterUser('gameData', function(e,data){

						if(e.success){
						
							if(data != null){

								// Receive OUR Game center data saved in Arrow. 
								// Here will be more logic process, at this moment, only overwrite local game progress data!!!

								gP.overwritePlayerProgress(JSON.parse(data));

								

							}else{
								Ti.API.info('Data is empty!');
							}
							

						}else{

							Ti.API.info('Error. This should not have happened. There is no user data. Error:'+e);

						}
					});


				} else if (e.code === 401) { 

					//User no exists, create new one

					iCloud.createUserFromGameCenter(player, function(e){

						if (e.success) {

							alert('New user in Arrow created from game center user' + JSON.stringify(e));
							
							// Create new dataProgress for this user. 

							var dataConfig = gP.getGameProgressJSONFile({newUser:true});

							var tempFile = Ti.Filesystem.createTempFile();
    						tempFile.write(dataConfig);

    						iCloud.createDataProgressForGameCenterUser(tempFile,function(e){

    							if (e.success) {
						            Ti.API.info('Data created for new user');
						        } else {
						            Ti.API.info('Error:'+JSON.stringify(e));
						        }

    						});

						} else {

							Ti.API.info('There was a problem...' + JSON.stringify(e));

						};

					});
				

				}

			});
		

			gameKit.getLeaderboardScore({
				identifier: 'bestScoresPlasticine',
				
					success: function(response) {
					/*	
					var puntuacionGameScore = response.localPlayer.value;
				//	var bestScore = parseInt(Alloy.Globals.statics.bestScore);
						
					if(bestScore<puntuacionGameScore){
						
						gameKit.submitScore('bestScores',bestScore);
					//	alert('Hemos detectado que tu puntuación local no estaba registrada y la hemos actualizado al Game Center');
						
						}else if(bestScore>puntuacionGameScore){
						
						//alert('Hemos detectado que tu puntuación en game Center es mejor que la del juego y la hemos actualizado');
							
							//bestScore = puntuacionGameScore;
							//Ti.App.Properties.setInt('bestScores',bestScore);
							
							var sRes = puntuacionGameScore.toString();
							Alloy.Globals.statics.bestScore = sRes;
							Ti.App.Properties.setString('bestScore', sRes);
							
						}else if(bestScore==puntuacionGameScore){
							
							//alert('Puntuacion estaba Actualizada');
						};
					*/	
									
					},
				error: function() {
					Ti.API.info('Error callback');	
					
				}
			});
			
		},
		error: function(error) {
			Titanium.API.info('An error occurred trying connect Game Center. Please try again later: '+JSON.stringify(error));
			//Alloy.Globals.statics.gameCenterEnabled=false;
			//alert('no')
		
		}
	});
	
};

exports.showRanking = function(id){
	gameKit.showLeaderboard(id);
};

exports.uploadScore = function(idTable,score){
	gameKit.submitScore(idTable,score);
};

exports.check = function(resultado){

	var bestResult = parseInt(Alloy.Globals.statics.bestScore);
	var actualResult = parseInt(resultado);
	var isRecord = false;
	
	if(actualResult > bestResult){

		gameKit.submitScore('bestScores',actualResult);
		Alloy.Globals.statics.bestScore = actualResult;
		Ti.App.Properties.setInt('bestScore', actualResult);
		isRecord = true;
	};
	
	return isRecord;
};


function gestionaTrofeos(puntos){
		
};
