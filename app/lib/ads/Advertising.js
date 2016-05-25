var Admob = require('ti.admob');

module.exports = function(args){

	/*
	 * ADMOB FOR BANNER ADS
	 */
	
	var numberAds = 3;
	var incAds = 0;
	
	var ad = null;
	var publicidadActiva = false;
		
	var alto=50;
	if (Ti.Platform.osname == 'ipad') {
	    alto=90;
	}else {
	 
	};
	
	ad = Admob.createView({
	    bottom: -alto,
	    width: Titanium.Platform.displayCaps.platformWidth, height: alto,
	    adUnitId: Alloy.CFG.admobId, // You can get your own at http: //www.admob.com/
	  	adBackgroundColor: 'white',
	  	testDevices: Alloy.CFG.testDevices,
	    // You can get your device's id for testDevices by looking in the console log after the app launched
	    //"156f9c0b050f2fdcbee423df3eae5909"
	   //  testing : true,
	});
	
	
	ad.addEventListener('didReceiveAd', function() {
	   ad.bottom=0;
	});
	ad.addEventListener('didFailToReceiveAd', function() {
	   ad.bottom=-alto;
	});
	ad.addEventListener('willPresentScreen', function() {
	   Ti.API.info('Presenting screen!');
	});
	ad.addEventListener('willDismissScreen', function() {
	    Ti.API.info('Dismissing screen!');
	});
	ad.addEventListener('didDismissScreen', function() {
	    Ti.API.info('Dismissed screen!');
	});
	ad.addEventListener('willLeaveApplication', function() {
	    Ti.API.info('Leaving the app!');
	});
	
	/*
	 * REVMOB FOR INTERSTICIAL ADS
	 */
	
	var revmob = null;
	
	function RevMob(appId) {
	  var moduleNames = { 'iPhone OS': 'com.revmob.titanium',  'android': 'com.revmob.ti.android' };
	  var revmobModule = require(moduleNames[Ti.Platform.name]);
	  revmobModule.startSession(appId);
	  return revmobModule;
	};
	
	
	revmob = new RevMob(Alloy.CFG.revmobId);
	
	revmob.addEventListener('sessionIsStarted', function(e) {
		
    Titanium.API.log('> Session started.');
    	publicidadActiva=true;
	});
	
	revmob.addEventListener('sessionNotStarted', function(e) {
	    Titanium.API.log('> Session failed to start.');
	    publicidadActiva=false;
	});
	
	revmob.addEventListener('adReceived', function(e) { Ti.API.info('Ad received.'); });
	revmob.addEventListener('adNotReceived', function(e) { Ti.API.info('Ad not received.'); });
	revmob.addEventListener('adDisplayed', function(e) { Ti.API.info('Ad displayed.'); });
	revmob.addEventListener('adClicked', function(e) { Ti.API.info('Ad clicked.'); });
	revmob.addEventListener('adClosed', function(e) { Ti.API.info('Ad closed.'); });

	revmob.showIntersticial = function(){
		Ti.API.info('Publicidad: '+publicidadActiva);
		
		if(publicidadActiva){
			
			if(numberAds === incAds){
				revmob.showFullscreen();
				Ti.API.info('Show full screen Ad');
				incAds = 0;			
			}else{
				incAds++;
			};
			
		};
	};
	

return {admob:ad,revmob:revmob};
};