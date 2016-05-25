var args = arguments[0] || {};
var gP = require('GameProgress');

// On init receive the parent args:

$.init = function(payload) {

  args.refreshAmount = payload.refreshAmount;

}

// Collection's fetch() method to initialize the collection and sync any stored models to the view

var col = Alloy.Collections.internalStore;

col.fetch();

// Some transforms to our models:

function doTransform(model) {
	
  var transform = model.toJSON();

  // If there is picture get it from database, otherwise use a default image:

  transform.Image = model.get("Image") === '' ? '/images/store/itemPicture.png' : '/images/store/'+transform.Image+'.png';

  // Change row color if item has already purchased
 
  transform.bgColor =  model.get("Purchased") ? Alloy.CFG.greenColor1 : Alloy.CFG.lightColor1; 

  // When making a "dataTransform" in XML, the cost value (<Label id="cost" text="{Cost} {CostSuffix}"/>) is overridden. We must get it back.

  transform.Cost =  model.get("Purchased") ? 'Purchased' : (transform.Cost +' '+ transform.CostSuffix); 

return transform;

}


// Table listener

function selectItem(e) {

	var item = col.get(e.rowData.modelId);

  var itemCost = item.get('Cost');
  var currentMoney = gP.getData('currentMoney');

  if(item.get('Purchased')){
            
    alert('Ya tienes ese objeto');
            
  } else {

    if(gP.checkCost(itemCost)){
      
      Ti.API.info('You HAVE MONEY!');

      item.buy({

        success: function(item) {

          // item is a backbone model of purchased item

          var product = item.toJSON();

/*
          Alloy.Globals.tracker.trackTransaction({
              transactionId: product.ItemID+'_'+product.Name,
              affiliation: "localStore",
              revenue: product.Cost,
              tax: 0.6,
              shipping: product.Quantity,
              currency: product.CostSuffix
          });
*/

          gP.discountFromCurrentMoney(product.Cost);
          args.refreshAmount();
          
          
        },

        error: function(evt) {

        }

      });
  

    col.trigger("sync");

    }else{

      Ti.API.info('You DONT HAVE MONEY!');
      alert('No tienes dinero');       

    };



  };

};

// Hide current tableview. 

exports.hideTable = function(){

  $.menuTable.hide();

}

// Show current tableview. 

exports.showTable = function(){

  $.menuTable.scrollToTop(0);
  $.menuTable.show();

}

// Show current tableview. 

function closeWindow(){
	Ti.API.info('Free model-view data binding resources');
	$.destroy();
}
