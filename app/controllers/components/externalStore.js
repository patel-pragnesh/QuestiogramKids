var args = arguments[0] || {};
var gP = require('GameProgress');

var storeKit = require('StoreKit');

// On init receive the parent args:

$.init = function(payload) {
  args.refreshAmount = payload.refreshAmount;
  args.refreshAdsButton = payload.refreshAdsButton;
  storeKit.putLoadingIndicator(payload.parent);
};

// Collection's fetch() method to initialize the collection and sync any stored models to the view:

var col = Alloy.Collections.externalStore;
col.fetch();

function doTransform(model) {
	
  var transform = model.toJSON();

  // If there is picture get it from database, otherwise use a default image:

  transform.Image = model.get("Image") === '' ? '/images/store/itemPicture.png' : '/images/store/'+transform.Image+'.png';

  // Change row color if item has already purchased
 
  transform.bgColor =  model.get("Purchased") ? Alloy.CFG.greenColor1 : Alloy.CFG.lightColor1; 

  // When making a "dataTransform" in XML, the cost value (<Label id="cost" text="{Cost} {CostSuffix}"/>) is overridden. We must get it back.

  transform.Cost =  model.get("Purchased") ? 'Purchased' : model.get("Cost");

  return transform;

};  

// Callback function. It will be fired when the purchase is completed successfully

function successfulPurchase(evt){

/*	
  EVT PARAMS:
  state[int]: The current state of the transaction; either Ti.Storekit.TRANSACTION_STATE_FAILED, Ti.Storekit.TRANSACTION_STATE_PURCHASED, Ti.Storekit.PURCHASING, or Ti.Storekit.TRANSACTION_STATE_RESTORED.
  quantity[int]: The number of items purchased or requested to purchase.
  productIdentifier[string]: The product's identifier in the in-app store.
  date[date]: Transaction date.
  identifier[string]: The transaction identifier
  receipt[object]: A blob of type "text/json" which contains the receipt information for the purchase.
*/

	
  var product = evt || {};

  if(product.productIdentifier){

    // If we are removing ads: 

    if(product.productIdentifier === 'removeAds'){

      gP.setAndSavePersistentData('adsActive',false);

      args.refreshAdsButton();

      alert('Ads removed');

    } else {	

      // If we are purchasing an item from database:

      Ti.API.info('Marking as purchased: ' + product.productIdentifier);

      var model = col.find(function(model) { return model.get('StoreRef') == product.productIdentifier; });

      if(model){

      model.buy({
          success:function(e){
            Ti.API.info('Saved in locas database');
          }
      });

      };

      args.refreshAmount();

      col.trigger("sync");



    };

    var model = col.find(function(model) { return model.get('StoreRef') == product.productIdentifier; });
/*
    Alloy.Globals.tracker.trackTransactionItem({
        transactionId: evt.identifier,
        name: evt.identifier,
        sku: model.ItemID,
        category: "In-APP",
        price: model.Cost,
        quantity: 1, // Need to implement;
        currency: "EUR"
    });
*/
  };


};

// Tableview listener

function selectItem(e) {

	var item = col.get(e.rowData.modelId);

	if(item.get('Purchased')){
		alert('Ya has comprado este objeto');
	}else{

		storeKit.requestProduct(item.get('StoreRef'), function (product) {
			storeKit.purchaseProduct(product,successfulPurchase);
		});

	}		
	
};

function removeAds(e){

  storeKit.requestProduct('removeAds', function (product) {
    storeKit.purchaseProduct(product,successfulPurchase);
  });

};

function restorePurchases(e){
  storeKit.restorePurchases(successfulPurchase);
};

/*
 EXPORTS
 */

exports.removeAds = removeAds;
exports.restorePurchases = restorePurchases;

exports.hideTable = function(){
	$.menuTable.hide();
}

exports.showTable = function(){
	$.menuTable.scrollToTop(0);
	$.menuTable.show();
}

function closeWindow(){
	Ti.API.info('Free model-view data binding resources');
	$.destroy();
}
