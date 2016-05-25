var GoogleAnalytics = require("analytics.google");

// Set this property on the module to true when you want to enable uncaught exception tracking (crashes). Must be called prior to setting trackUncaughtExceptions
//GoogleAnalytics.trackUncaughtExceptions = true; 

// Set this property if you would like to change the sending data interval in seconds (iOS) or minutes (Android)
//GoogleAnalytics.dispatchInterval = 20; 

// Set this property to true if you want to disable analytics across the entire app.

//GoogleAnalytics.optOut = Alloy.CFG.analyticsDisabled;

var GA = null;

// Init session with google:

exports.initGoogleAnalytics = function(){

	GA = GoogleAnalytics.getTracker(Alloy.CFG.googleAnalyticsId);

	Ti.API.info('Google analytics enabled: '+GA);

}

// Send screen tracker to analytics provider
// @params: Provider (at this moment only google) and name (Name of the screen)

exports.sendScreen = function(provider, name){

	Ti.API.info(GA);
	var args = args || {};
	
	if(provider === "google"){
		GA.trackScreen({
			screenName: name
		});
	}else{
		// Future implementation of more analytic networks
	};
	
}

// Send event tracker to analytics provider
// @params: Provider (at this moment only google) and args to track (category, action and label)

exports.event = function(provider, args){

	var args = args || {};
	Ti.API.info(GA);
	
	if(provider === "google"){

		GA.trackEvent({
			category: args.category,
			action: args.action,
			label: args.label,
			value: 1
		});
	}else{

		// Future implementation of more analytic networks

	};
	
}

// Throw exception tracker to analytics provider
// @params: Provider (at this moment only google) and args to track (description and fatalException)

exports.exception = function(provider,args){

	var args = args || {};

	if(provider === "google"){

		GA.trackException({
		    description: args.description,
		    fatal: args.fatalException
		});

	}else{

		// Future implementation of more analytic networks

	};

}

// Send time information tracker to analytics provider
// @params: Provider (at this moment only google) and args to track (timespent, name, label)

exports.timing = function(provider,args){

	var args = args || {};

	if(provider === "google"){

		GA.trackTiming({
			category: "TIMMING",
			time: args.timeSpent,
			name: args.name,
			label: args.label
		});

	}else{

		// Future implementation of more analytic networks

	};

}

// Send item transaction tracker to analytics provider
// @params: Provider (at this moment only google) and args to track (product args)

exports.transactionItem = function(provider,args){

	var args = args || {};

	if(provider === "google"){

		GA.trackTransactionItem({
			transactionId: args.id,
		    name: args.name,
		    sku: args.sku,
		    category: args.category,
		    price: args.price,
		    quantity: args.quantity,
		    currency: args.cad
		});

	}else{

		// Future implementation of more analytic networks

	};

}


// Send general transaction tracker to analytics provider
// @params: Provider (at this moment only google) and args to track (product args)

exports.transaction = function(provider,args){

	var args = args || {};

	if(provider === "google"){

		GA.trackTransaction({
			transactionId: args.id,
		    affiliation: args.store,
		    revenue: args.revenue,
		    tax: args.tax,
		    shipping: args.quantity,
		    currency: args.cad
		});

	}else{

		// Future implementation of more analytic networks

	};

}

// Send social tracker to analytics provider
// @params: Provider (at this moment only google) and args to track (social network, action, target)

exports.social = function(provider,args){

	var args = args || {};

	if(provider === "google"){

		GA.trackSocial({
		    network: args.activity,
		    action: args.action,
		    target: args.target
		});

	}else{

		// Future implementation of more analytic networks

	};

}

