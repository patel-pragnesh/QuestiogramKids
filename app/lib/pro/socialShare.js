
if (OS_IOS){

	var game = Alloy.Globals.gameView;

	/*
	 * Importing two modules:
	 * dk.napp.social for official dialog sharing (facebook, twitter, whatsapp, linkedin)...
	 * com.kosso.tigram to open native apps (like instagram);
	 *
	 */

	var Social = require('dk.napp.social');
	var tigram = require('com.kosso.tigram');

	/*
	 * Module listeners. 
	 */
  
	Social.addEventListener("facebookAccount", function(e){ 
		Ti.API.info("facebookAccount: "+e.success);	
		fbAccount = e.account;
		Ti.API.info(e); 
	});

	Social.addEventListener("twitterRequest", function(e){ //default callback
		Ti.API.info("twitterRequest: "+e.success);	
		Ti.API.info(e.response); //json
		Ti.API.info(e.rawResponse); //raw data - this is a string
	});



	Social.addEventListener("facebookRequest", function(e){ //default callback
		Ti.API.info("facebookRequest: "+e.success);	
		Ti.API.info(e); 
	});

	Social.addEventListener("facebookProfile", function(e){
		Ti.API.info("facebook profile: "+e.success);	
		Ti.API.info(e.response); //json
	});

	Social.addEventListener("complete", function(e){
		Ti.API.info("complete: " + e.success);
		console.log(e);

		if(e.success && e.type === 'complete'){

			// Here is a good place to throw a tracker event (trackSocial);


		};

		if (e.platform == "activityView" || e.platform == "activityPopover") {
			switch (e.activity) {
				case Social.ACTIVITY_TWITTER:
					Ti.API.info("User is shared on Twitter");
					break;

				case Social.ACTIVITY_CUSTOM:
					Ti.API.info("This is a customActivity: " + e.activityName);
					break;
			}
		}
	});

	Social.addEventListener("error", function(e){



	});

	Social.addEventListener("cancelled", function(e){

		Ti.API.info("cancelled:");

		// Here is a good place to throw a tracker event (trackSocial);

	});


	Social.addEventListener("customActivity", function(e){

		Ti.API.info("customActivity");	
		Ti.API.info(e);	

	});
};

/*
 * Open social share dialog. 
 */

exports.showDialog = function(text,image,source){

	if(OS_IOS){

		var texto = text;
		
		if(Ti.Platform.osname=='ipad'){
			
			// For iPad the App will show a popover and we can´t pass a platino sprite as a view parameter, so we do this trick:

			var scaleX = game.size.width/game.screen.width;
			var scaleY = game.size.height/game.screen.height;

			var button_view = Ti.UI.createView({
				backgroundColor : "transparent",
				left: source.x*scaleX,
				top: source.y*scaleY, 
				height: source.height*scaleY,
				width: source.width*scaleX
			});

	        Social.activityPopover({
	            text:texto+Alloy.CFG.urls.store_short,
	            image:image,
	            view: button_view
	        });
	 
		
	 	}else{

			Social.activityView({
		        text:texto+Alloy.CFG.urls.store_short,
		        url:Alloy.CFG.urls.shortenUrl,
		        image:image
		    });
	    
	    };

    } else if(OS_ANDROID) {

    	// Getting the image path:

		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,image);

		// If file exists on system, send a intent with image. 

		if(file.exists()){

			var B = file.read();

			var shareIntent = Ti.Android.createIntent({
                action: Ti.Android.ACTION_SEND,
                type: "image/png",
            });
 
            shareIntent.putExtra(Ti.Android.EXTRA_TITLE, "Photo via Plasticine!");
            shareIntent.putExtra(Ti.Android.EXTRA_TEXT, text);

            // Create a temp file immediately before firing up the intent to avoid garbage collector. (From http://stephenfeather.com/blog/titanium-open-pdf-with-intents-resolved-android/)

            var filenameBase = new Date().getTime();
			var tmpFile = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,filenameBase+'.png');
			tmpFile.write(B);

			// Attatch the picture :

            shareIntent.putExtraUri(Ti.Android.EXTRA_STREAM, tmpFile.nativePath);

            // Send intent:
            
            Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(shareIntent, "Share Image!"));

        // If there is no file on system, send a intent with plain text.   

		} else {

	    	var shareIntent = Ti.Android.createIntent({
		        action: Ti.Android.ACTION_SEND,
		        type: "text/plain",
		    });

		    shareIntent.putExtra(Ti.Android.EXTRA_TEXT, text);
		    Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(shareIntent, "Share Text!"));

		};
    };

};

/*
 * Open openNativeApp dialog (for linkedin)
 */

exports.shareWithInstagram = function(imageToShare, text){

	if(OS_IOS){
	// Some problems using this way:
	// var image = Ti.Utils.base64encode("sprites/close.png");
	// var filename = Titanium.Filesystem.applicationDataDirectory + "sprites/close.png";
	// f = Titanium.Filesystem.getFile(filename);
	// f.write( anImageView.toImage() );


	// Using this instead:

		var assetImage = Titanium.UI.createImageView({
			image: imageToShare,
		});


		var d = assetImage.toBlob();

		if(tigram.isInstalled){

		// Here is a good place to throw a tracker event (trackSocial);

			tigram.openPhoto({
				media:d,
				caption:text
			});

		} else {
			alert("Instagram is not installed!");
		};

	}
};
