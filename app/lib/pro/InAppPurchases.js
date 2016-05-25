/*
    InAppPurchases: Module created by @arayon_ 2015
    Module to make in-app purchases in iOS and Android. 
    It uses two open source libraries (InAppBilling for Android and Ti.Storekit for iOS) in order to achieve crossplatform compatibility
    InAppBilling source code: https://github.com/appcelerator-modules/ti.InAppAndroid
    Ti.Storekit: https://github.com/appcelerator-modules/ti.InAppIOS
    TODO: Enable subscriptions
    TODO: Verify receipts with own servers
 */


////////////////////////////////////////////////////////
// CONSTANTS. At this moment are declared inside this module (hard coded) for security reasons. 
////////////////////////////////////////////////////////


// The bundleVersion of the app in IOS, used when validating the receipt. 

var IOS_BUNDLE_VERSION = "1.0.0" ; 

// The bundleIdentifier of the app in IOS, used when validating the receipt. 

var IOS_BUNDLE_ID = "com.arei.plasticineTemplate" ; 

// ApplicationUsername is a opaque identifier for the user’s account on your system. Used by Apple to detect irregular activity. Should hash the username before setting. Not used right now
                
var IOS_HASHED_USERNAME = '' ;               

// Android Base64-encoded RSA public key, get this from the Google Developer Console

var ANDROID_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuYYqXVgBOCWNvqJ9j0GqJwH+uV2xOOXOYtFWuROu1LMEjKnyMggHKFQO/M5vkGp4vf0rwOHngr+d/p+aEwBsC7UXfgOy9e0bnqQOxUYggT/A5/WY3FIg1EW+h1N/wqnF1HXereOhhg7OozA5mkI1Jg6QanmVJ1IHN8c+5G2AlWrmjS3PIkIKj1H3nNUtAdFio5WOHTNLcHi3x6Opg16mrnHSimvFBKlP+FYLppxAsulpd1htpf6KsmMPdfCv57Ih1VLErMedilyifsu9ZuocpL1jnPphba74S8DZdhzMK7tXJ4tYUYclcvReUBXNvu6kahDTl/U1MkzH2tDVeVlIhwIDAQAB" ; 

// It is important to verify that the developer payload of the purchase is correct. It will be the same one that you sent when initiating the purchase.
// https://github.com/appcelerator-modules/ti.inappbilling/blob/stable/android/documentation/index.md#verify-the-developer-payload 

var ANDROID_DEVELOPER_PAYLOAD = "MK7tXJ4tYUYclcvReUBXNvu6kahDTl/U1MkzH2tDVeVlIhwIDAQAB" ;


////////////////////////////////////////////////////////
// IMPORT AND BASIC INITIALIZATION
////////////////////////////////////////////////////////


if(OS_IOS){

    var InAppIOS = require('ti.storekit');

    // An alert dialog warning will now be shown when run in the simulator. This dialog can be disabled by setting the suppressSimulatorWarning property on the module to true.

    InAppIOS.suppressSimulatorWarning = true;

    // Whether or not to use Apple's Sandbox verification server.
     
    InAppIOS.receiptVerificationSandbox = (Ti.App.deployType !== 'production');

    // The shared secret for your app that you created in iTunesConnect; required for verifying auto-renewable subscriptions.

    InAppIOS.receiptVerificationSharedSecret = "";

    // This property should be set to false and finish handled manually if any of the products to be purchased are downloadable products

    InAppIOS.autoFinishTransactions = true;

    // It is more secure to set it in the code than to read it out of the bundle. Required when calling validateReceipt.

    InAppIOS.bundleVersion = IOS_BUNDLE_VERSION; 

    // It is more secure to set it in the code than to read it out of the bundle. Required when calling validateReceipt.

    InAppIOS.bundleIdentifier = IOS_BUNDLE_ID; 

    // Flag used to know if InAppIOS has connected with Apple and everything seems ok. 

    var verifyingReceipts = false;



} else if (OS_ANDROID) {

    // This method should be called before calling any other method and should only be called once. Calling this method results in a setupcomplete event.

    var InAppAndroid = require('ti.inappbilling');

};

////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////

/*

    SYNCSTORE:
    Requests a product.
    Check the items found in externalstore local DB with those saved in iTunesConnect & GooglePlay, getting data like the localized name and price for the current user.
    In IOS is made directly, while in android is done in setupcomplete, executed after the module in initialized

*/

function syncStore() {

    if(OS_IOS){

        // Items collection:

        var col = Alloy.Collections.externalStore;
        col.fetch();

        var d = col.toJSON();

        // Iterate the items saved in externalstore :

        _.each(d, function(item){

            requestProduct(item.StoreRef, function(prod){
                
                var model = col.get(item.ItemID);
        
                model.set({
                    Name:prod.title,
                    Description:prod.description,
                    Cost:prod.formattedPrice
                }).save();

                Ti.API.info('Getting IOS item from iTunesConnect: ' + prod ) ;
            });

         
        });

        // Update the collection

        col.trigger("sync");

    }else if(OS_ANDROID) {

        InAppAndroid.state = 'init';
 
        InAppAndroid.startSetup({

            publicKey: ANDROID_PUBLIC_KEY,
            debug: false

        });

    };   

};

/*

    PURCHASEPRODUCT:
    Purchase a product.

*/

function purchaseProduct(product, success) {

    if(OS_IOS) {

        //showLoading();

        // Save in module properties the success callback so it will be fired later. 

        InAppIOS.successfulPurchase = success;

        requestProduct(product, function (item) {

            InAppIOS.purchase({
                product: item
                // applicationUsername: 'IOS_HASHED_USERNAME'
            });

        });
              
    } else if (OS_ANDROID) {

        InAppAndroid.purchase({
            productId: product, // 'android.test.purchased'
            type: InAppAndroid.ITEM_TYPE_INAPP,
            developerPayload: ANDROID_DEVELOPER_PAYLOAD
        });
        
        InAppAndroid.successfulPurchase = success;
    };

};



/*

    REQUESTPRODUCT
    Ask for a product by id (storeRef).
    Returns the product itself

*/

function requestProduct(identifier, success) {

    if(OS_IOS) {

        //  showLoading();

        InAppIOS.requestProducts([identifier], function (evt) {
            
            //hideLoading();

            if (!evt.success) {
                alert(L('inApp_server_problem'));
            } else if (evt.invalid) {
                alert(L('item_not_found'));
            } else {
                success(evt.products[0]);
            };

        });

    } else if (OS_ANDROID) {

        InAppAndroid.state = 'requestProduct' ;

        InAppAndroid.requestedProduct = identifier;

        InAppAndroid.successfulPurchase = success ;

        InAppBilling.queryInventory({

            moreItems: [identifier]
          
        });

    };
  
};


/*

    RESTORE PURCHASES
    Restore previous purchases of user

*/

function restorePurchases(success) {

    if(OS_IOS) {

        // showLoading();
        InAppIOS.successfulRestore = success;
        InAppIOS.restoreCompletedTransactions();

    } else if (OS_ANDROID) {

        InAppAndroid.state = 'restore';
        InAppAndroid.successfulRestore = success;
        InAppAndroid.queryInventory();

    };

}


////////////////////////////////////////////////////////
// LISTENERS AND CALLBACKS
////////////////////////////////////////////////////////

// ANDROID

if (OS_ANDROID){


    InAppAndroid.addEventListener('setupcomplete', function(e) {
     
        if (e.success) {
            Ti.API.info('Setup completed successfully!. Looking for items in Android Store');
            InAppAndroid.queryInventory();
      
        } else {
            Ti.API.info('Setup FAILED.');
        }
    });


    InAppAndroid.addEventListener('queryinventorycomplete', function(e) {
     
    	var inventory = e.inventory;    
        var col = Alloy.Collections.externalStore;
    	col.fetch();

    	var d = col.toJSON();

    	var syncProducts = [];

        if(InAppAndroid.state === 'init'){

        	if (e.success) {
        		
        		_.each(d, function(item){
        	

        			if (inventory.hasDetails(item.StoreRef)) {
        				
        				var model = col.get(item.ItemID);
        				
        				model.set({
        					Name:prod.title,
        					Description:prod.description,
        					Cost:prod.formattedPrice
        				}).save();
        	
        				console.log(item.ItemID);
        				console.log(prod);

        			}else{
        				Ti.API.info(item.StoreRef +'Not found in Google Play');
        			};

        		});
        	
        		col.trigger("sync");
        	};

        } else if (InAppAndroid.state === 'restore') {

            Ti.API.info( 'Restoring' + JSON.stringify(e));

            if (e.success) {
                
                _.each(d, function(item){

                    if (inventory.hasPurchase(item.StoreRef)) {

                        Ti.API.info('Restoring '+item.StoreRef);

                        var purchase = inventory.getPurchase(item.StoreRef);

                        if(purchase.purchaseState === InAppAndroid.PURCHASE_STATE_PURCHASED){

                            var purchasedProduct = convertAndroidPurchaseToIOS(purchase);

                            InAppAndroid.successfulRestore(purchasedProduct);

                        };
                    }
                });
            
                col.trigger("sync");
            };

        } else if (InAppAndroid.state === 'requestProduct') { 

            if (inventory.hasDetails(InAppAndroid.requestedProduct)) {

                Ti.API.info (InAppAndroid.requestedProduct + 'found!') ;

                InAppAndroid.successfulPurchase(inventory.getDetails(InAppAndroid.requestedProduct));
            };
        };
    	
    });

    /*
     FOR TESTING STATIC RESPONSES:

        1. In purchaseProduct set productId : 'android.test.purchased';

        2. In purchase callback:

        InAppAndroid.addEventListener('purchasecomplete', function(e) {
            var purchasedProduct = convertAndroidPurchaseToIOS(e.purchase);
            InAppAndroid.successfulPurchase(purchasedProduct);
         });   
         
     */

    InAppAndroid.addEventListener('purchasecomplete', function(e) {

        if (e.success && e.purchase) {
            
            // In Android we need to know if the product is consumable or not. In this case (consumable product ) we'll force to consume after the purchase. 
        	
            var col = Alloy.Collections.externalStore;
            col.fetch();
            
            // _.findWhere not working!
            var tempModel = col.where({ StoreRef: product });
            var model = tempModel[0].toJSON();

            if(model.Type==='consumable'){

                InAppAndroid.consume({
                    purchases: [e.purchase]
                });

            };
           
            // Now we launch the success callback

            var purchasedProduct = convertAndroidPurchaseToIOS(e.purchase);
            InAppAndroid.successfulPurchase(purchasedProduct);
             
        }

    });

    InAppAndroid.addEventListener('consumecomplete', function(e) {

        Ti.API.info('Consume response: ' + responseString(e.responseCode));
        if (e.success) {
            Ti.API.info('Consume completed successfully');
        }

    });

};
// IOS

/**
 * Purchases a product.
 * @param product A Ti.InAppIOS.Product (hint: use InAppIOS.requestProducts to get one of these!).
 */

if (OS_IOS) {

    InAppIOS.addEventListener('transactionState', function (evt) {
        
        //hideLoading();

        switch (evt.state) {
            case InAppIOS.TRANSACTION_STATE_FAILED:
                if (evt.cancelled) {
                    alert('Purchase cancelled');
                } else {

                    alert('ERROR: Buying failed! ' + evt.message);
                }
                evt.transaction && evt.transaction.finish();
                break;
            case InAppIOS.TRANSACTION_STATE_PURCHASED:
                if (verifyingReceipts) {
                    if (IOS7) {
                        // iOS 7 Plus receipt validation is just as secure as pre iOS 7 receipt verification, but is done entirely on the device.
                        //alert('Es aquí');
                        if(InAppIOS.validateReceipt()){
                            InAppIOS.successfulPurchase(evt);
                            // track a transaction
                        }else{
                            alert('Sorry. Receipt is invalid');
                        };
                        
                        //var msg = InAppIOS.validateReceipt() ? 'Receipt is Valid!' : 'Receipt is Invalid.'; 
                        //alert(msg);
                    } else {
                        // Pre iOS 7 receipt verification
                        InAppIOS.verifyReceipt(evt, function (e) {
                            if (e.success) {
                                if (e.valid) {
                                    //alert('Thanks! Receipt Verified');
                                    InAppIOS.successfulPurchase(evt);
                                
                                } else {
                                    alert('Sorry. Receipt is invalid');
                                }
                            } else {
                                alert(e.message);
                            }
                        });
                    }
                } else {
                    //alert('Thanks!');
                    InAppIOS.successfulPurchase(evt);
                    //markProductAsPurchased(evt.productIdentifier);
                }
                
                // If the transaction has hosted content, the downloads property will exist
                // Downloads that exist in a PURCHASED state should be downloaded immediately, because they were just purchased.
                if (evt.downloads) {
                    InAppIOS.startDownloads({
                        downloads: evt.downloads
                    });
                } else {
                    // Do not finish the transaction here if you wish to start the download associated with it.
                    // The transaction should be finished when the download is complete.
                    // Finishing a transaction before the download is finished will cancel the download.
                    evt.transaction && evt.transaction.finish();
                }
                
                break;
            case InAppIOS.TRANSACTION_STATE_PURCHASING:
                Ti.API.info('Purchasing ' + evt.productIdentifier);
                break;
            case InAppIOS.TRANSACTION_STATE_RESTORED:
                // The complete list of restored products is sent with the `restoredCompletedTransactions` event
                InAppIOS.successfulRestore(evt);
                Ti.API.info('Restored ' + evt.productIdentifier);
                // Downloads that exist in a RESTORED state should not necessarily be downloaded immediately. Leave it up to the user.
                if (evt.downloads) {
                    Ti.API.info('Downloads available for restored product');
                };
                
                evt.transaction && evt.transaction.finish();
                break;
        }
    });


    /**
     * Restores any purchases that the current user has made in the past, but we have lost memory of.
     */


    InAppIOS.addEventListener('restoredCompletedTransactions', function (evt) {
        
        // hideLoading();
        
        if (evt.error) {
            alert(evt.error);
        }
        else if (evt.transactions == null || evt.transactions.length == 0) {
            alert(L('no_purchases_restore'));
        }
        else {

            if (IOS7 && verifyingReceipts) {
                if (InAppIOS.validateReceipt()) {
                    Ti.API.info('Restored Receipt is Valid!');
                    //InAppIOS.successfulRestore(evt);
                } else {
                    Ti.API.error('Restored Receipt is Invalid.');
                } 
            }
            for (var i = 0; i < evt.transactions.length; i++) {
                if (!IOS7 && verifyingReceipts) {
                    InAppIOS.verifyReceipt(evt.transactions[i], function (e) {
                        if (e.valid) {
                        
                        } else {
                            Ti.API.error("Restored transaction is not valid");
                        }
                    });
                } else {

                };
            }
            alert(L('items_restored'));
        }
    });
     
    /**
     * WARNING
     * addTransactionObserver must be called after adding the InAppIOS event listeners.
     * Failure to call addTransactionObserver will result in no InAppIOS events getting fired.
     * Calling addTransactionObserver before event listeners are added can result in lost events.
     */

    InAppIOS.addTransactionObserver();
     
};

////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////

// ANDROID

// Convert the Android receipt format in iOS style :

function convertAndroidPurchaseToIOS(purchase){

    var product = {
        state : purchase.purchaseState,
        quantity : 1,
        productIdentifier : purchase.productId,
        date : new Date(purchase.purchaseTime),
        identifier : purchase.orderId,
        applicationUsername: purchase.developerPayload,
        receipt : purchase.token
    };

    return product;

};

function responseString(responseCode) {
    switch (responseCode) {
        case InAppAndroid.RESULT_OK:
            return 'OK';
        case InAppAndroid.RESULT_USER_CANCELED:
            return 'USER CANCELED';
        case InAppAndroid.RESULT_BILLING_UNAVAILABLE:
            return 'BILLING UNAVAILABLE';
        case InAppAndroid.RESULT_ITEM_UNAVAILABLE:
            return 'ITEM UNAVAILABLE';
        case InAppAndroid.RESULT_DEVELOPER_ERROR:
            return 'DEVELOPER ERROR';
        case InAppAndroid.RESULT_ERROR:
            return 'RESULT ERROR';
        case InAppAndroid.RESULT_ITEM_ALREADY_OWNED:
            return 'RESULT ITEM ALREADY OWNED';
        case InAppAndroid.RESULT_ITEM_NOT_OWNED:
            return 'RESULT ITEM NOT OWNED';
        case InAppAndroid.IAB_RESULT_REMOTE_EXCEPTION:
            return 'IAB RESULT REMOTE EXCEPTION';
        case InAppAndroid.IAB_RESULT_BAD_RESPONSE:
            return 'IAB RESULT BAD RESPONSE';
        case InAppAndroid.IAB_RESULT_VERIFICATION_FAILED:
            return 'IAB RESULT VERIFICATION FAILED';
        case InAppAndroid.IAB_RESULT_SEND_INTENT_FAILED:
            return 'IAB RESULT SEND INTENT FAILED';
        case InAppAndroid.IAB_RESULT_UNKNOWN_PURCHASE_RESPONSE:
            return 'IAB RESULT UNKNOWN PURCHASE RESPONSE';
        case InAppAndroid.IAB_RESULT_MISSING_TOKEN:
            return 'IAB RESULT MISSING TOKEN';
        case InAppAndroid.IAB_RESULT_UNKNOWN_ERROR:
            return 'IAB RESULT UNKNOWN ERROR';
        case InAppAndroid.IAB_RESULT_SUBSCRIPTIONS_NOT_AVAILABLE:
            return 'IAB RESULT SUBSCRIPTIONS NOT AVAILABLE';
        case InAppAndroid.IAB_RESULT_INVALID_CONSUMPTION:
            return 'IAB RESULT INVALID CONSUMPTION';
    }
    return '';
}

function purchaseStateString(state) {
    switch (state) {
        case InAppAndroid.PURCHASE_STATE_PURCHASED:
            return 'PURCHASE STATE PURCHASED';
        case InAppAndroid.PURCHASE_STATE_CANCELED:
            return 'PURCHASE STATE CANCELED';
        case InAppAndroid.PURCHASE_STATE_REFUNDED:
            return 'PURCHASE STATE REFUNDED';
    }
    return '';
}

function purchaseTypeString(state) {
    switch (state) {
        case InAppAndroid.ITEM_TYPE_INAPP:
            return 'ITEM TYPE INAPP';
        case InAppAndroid.ITEM_TYPE_SUBSCRIPTION:
            return 'ITEM TYPE SUBSCRIPTION';
    }
    return '';
}

function purchaseProperties(p) {
    var str = 'type: ' + purchaseTypeString(p.type) + 
        '\norderId: ' + p.orderId +
        '\npackageName: ' + p.packageName + 
        '\nproductId: ' + p.productId +
        '\npurchaseTime: ' + new Date(p.purchaseTime) +
        '\npurchaseState: ' + purchaseStateString(p.purchaseState) +
        '\ndeveloperPayload: ' + p.developerPayload +
        '\ntoken: ' + p.token;

    return str;
}


// IOS

/*
 During development it is possible that the receipt does not exist.
 This can be resolved by refreshing the receipt.
 */

function checkIfReceiptIsValid(){
    
    if (IOS7) {
        
        function validate() {
            Ti.API.info('Validating receipt.');
            Ti.API.info('Receipt is Valid: ' + InAppIOS.validateReceipt());
        };

        if (!InAppIOS.receiptExists) {
            Ti.API.info('Receipt does not exist yet. Refreshing to get one.');
            InAppIOS.refreshReceipt(null, function(){
                validate();
            });
        } else {
            Ti.API.info('Receipt does exist.');
            validate();
        };
    };
};


////////////////////////////////////////////////////////
// EXPORTS
////////////////////////////////////////////////////////

exports.sync = syncStore;
exports.purchaseProduct = purchaseProduct;
exports.requestProduct = requestProduct; 
exports.restorePurchases = restorePurchases;

if(OS_IOS){
    exports.checkIfReceiptIsValid =checkIfReceiptIsValid;
    exports.requestProducts = InAppIOS.requestProducts; 
};

 


 




