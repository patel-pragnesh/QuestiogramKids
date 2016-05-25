/*
	REST API FOR DELTADNA:
	MORE INFO: http://docs.deltadna.com/rest-api/
	BY @arayon_ 2015

	// TODO: Enable Hashing and A/B tests
*/	

var plasticine = require('Plasticine');
var GameProgress = plasticine.GameProgress;

// Take these parameters from your Dashboard:

var key = {
  collectURL: Alloy.CFG.deltaDna.collectURL,
  dev: Alloy.CFG.deltaDna.dev,
  live: Alloy.CFG.deltaDna.live
};

// Basic constants or user vars:

var userID = Titanium.Platform.id;
var sessionID = generateSessionID();

// METHODS:

// GENERATE USER ID:
// Make an HTTP GET to the Collect API to generate a Unique User ID. If you already have a Unique User ID you will not need to use this unless you wish to obfuscate your User ID.

function generateUserID() {

  var url = getUrl('userID');
  var xhr = Ti.Network.createHTTPClient({

      onload: function(e) {
        // this function is called when data is returned from the server and available for use :
        if (this.responseText) {
          try {
            Ti.API.info('Received response from DeltaDna. Creating new user...');
            var response = JSON.parse(this.responseText);
            sendEvent(response.userID);
          } catch(e) {
            Ti.API.info('There was a problem trying to connect with DeltaDna: '+ e); //error in the above string(in this case,yes)!         
          };
        };
        
      },
      onerror: function(e) {
        // this function is called when an error occurs, including a timeout
        Ti.API.info(e.error);

      },
        timeout:5000  /* in milliseconds */
  });

  xhr.open("GET", url);
  xhr.send();  // request is actually sent with this statement

};

// SEND EVENT
// At this moment, just some events are taken from deltaDNA, but this method will be one of the most important ones in this module. 
// Type is a predefinied event in your deltaDna dashboard. 
// Params is used if you send the data from the app, in this case type must be 'single' or 'multiple'


function sendEvent(type, params) {

  switch(type) {

    case 'newPlayer':

      var data = {
        eventName : "newPlayer", 
        userID : userID,
        sessionID:sessionID,
        eventParams : {
          userCountry:Ti.Locale.getCurrentCountry(),
          platform:getDeltaDnaPlatform(),
          userLevel:0,
          userScore:GameProgress.getData('maxScore')
        } 
      };

      singleEvent(data);

    break;

    case 'gameStarted':

      var data = {
        eventName : "gameStarted", 
        userID : userID,
        sessionID:sessionID,
        eventParams : {
          sdkVersion:Titanium.App.version,
          platform:getDeltaDnaPlatform(),
          userLevel:0,
          userScore:GameProgress.getData('maxScore')
        } 
      };

      singleEvent(data);

    break;

    case 'newPlayerExtended':

      var data = {
        eventList: 
        [
          {
            eventName : "newPlayer", 
            userID : userID,
            sessionID:sessionID,
            eventParams : {
              userCountry:Ti.Locale.getCurrentCountry(),
              platform:getDeltaDnaPlatform(),
              userLevel:0,
              userScore:GameProgress.getData('maxScore')
            }
          },
          {
            eventName: "clientDevice",
            userID : userID,
            sessionID:sessionID,
            eventParams: {
               deviceName: Ti.Platform.username,
               deviceType: getDeltaDnaFormFactor(),
               manufacturer: Ti.Platform.manufacturer,
               platform:getDeltaDnaPlatform()
            }
          }
        ]    
      };

      bulkEvent(data);

    break;

    case 'single':

      singleEvent(params);

    break;  

    case 'multiple':

      bulkEvent(params);

    break;  

  }

};


// LOGIC FUNCTIONS:

function generateSessionID() {

  // Session creating a hash of the current timestamp
  var timeStamp = new Date().getTime();
  var session = Titanium.Utils.md5HexDigest(timeStamp.toString());
  return session;
}

function getUrl(type) {

  switch(type){

    case 'userID':
      return key.collectURL+'uuid';
    break;
    case 'event':
      return key.collectURL+key.dev;
    break;
    case 'bulk':
      return key.collectURL+key.dev+'/bulk';
    break;

  }
}

// FORMAT SOME CONSTANTS WITH VALUES EXPECTED FOR DELTA DNA:

function getDeltaDnaFormFactor() {

  if(Alloy.isTablet) {
    return "TABLET";
  } else {
    return "HANDHELD";
  };

}

function getDeltaDnaPlatform() {

  if (OS_IOS) {
    if (getDeltaDnaFormFactor() === 'TABLET') {
      return "IOS_TABLET";
    } else {
      return "IOS_MOBILE";
    }
  }else if(OS_ANDROID) {
    if (getDeltaDnaFormFactor() === 'TABLET') {
      return "ANDROID_TABLET";
    } else {
      return "ANDROID_MOBILE";
    };
  };
}


// All events should be sent to the server in the body of the request as a JSON document. 

function singleEvent(params) {

  var url = getUrl('event');
  var xhr = Ti.Network.createHTTPClient({

    onload: function(e) {
        // this function is called when data is returned from the server and available for use
        Ti.API.info('Success'+e);
    },
    onerror: function(e) {
      // this function is called when an error occurs, including a timeout
       Ti.API.info('Error'+e.error);
    },
      timeout:5000  /* in milliseconds */
  });

  xhr.open('POST', url);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('charset','utf-8');

  xhr.send(JSON.stringify(params));

}

// It is possible to send multiple events in a single POST, indeed this approach is preferable due to efficiencies in connection pooling etc..

function bulkEvent(params) {

  var url = getUrl('bulk');

  var xhr = Ti.Network.createHTTPClient({
    
    onload: function(e) {
        // this function is called when data is returned from the server and available for use
        Ti.API.info('Success'+e);
    },
    onerror: function(e) {
      // this function is called when an error occurs, including a timeout
       Ti.API.info('Error'+e.error);

    },
      timeout:5000  /* in milliseconds */
  });

  xhr.open('POST',url);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('charset','utf-8');
 
  xhr.send(JSON.stringify(params));

}


exports.generateUserID = generateUserID;
exports.sendEvent = sendEvent;

