/*
 * MAIN WINDOW 
 * Main store window shopping.
 * It is just one example of how to manage a local store and a remote store on the same screen
 */

var args = arguments[0] || {};
var gP = require('GameProgress');

/*
  The currentMoney label and removeAds button belong to this screen but should be used in externalstore and localstore components. 
  We encapsulate them in functions in order to pass them to the components as a callback.
*/

function refreshAmount() {
  $.currentMoney.text = "Your money:" + gP.getData('currentMoney');
}


function refreshAdsButton() {
  gP.getData('adsActive') ? $.removeAdsBtn.show() : $.removeAdsBtn.hide();
}

refreshAdsButton();
refreshAmount();


//Payload: Object to pass to localStore and externalStore components. 

var payload = {

  parent : $.store,
  refreshAmount : refreshAmount,
  refreshAdsButton : refreshAdsButton

};

$.localStore.init(payload);
$.externalStore.init(payload);

$.externalStore.hideTable();

// $.changeTableBtn listener. Switch between local and external store

function changeTable(e) {

  if (e.source.option) {

    e.source.title = "Get More Money!";
    $.externalStore.hideTable();
    $.localStore.showTable();

  } else {

    e.source.title = "Show items!";
    $.externalStore.showTable();
    $.localStore.hideTable();

  }

  e.source.option = !e.source.option;

}

// $.restoreProducts listener. 

function restorePurchases() {

  $.externalStore.restorePurchases();
}

// $.removeAdsBtn listener. 

function removeAds() {

  $.externalStore.removeAds();

}

function closeWindow() {

  Ti.API.info('Free model-view data binding resources');
  $.destroy();

}
