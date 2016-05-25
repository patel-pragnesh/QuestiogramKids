var plasticine = require('Plasticine');

function init() {
	setTimeout(function() {
		plasticine.openScene("scenes/Questiogram");
	}, 500);
};

// On Android, the game view must be added to the window before it is opened. Otherwise, the app will crash when you attempt to open it:
$.win.add(Alloy.Globals.gameView);
// We kept in Alloy.Globals the window where the gameView is added:
Alloy.Globals.gameWindow = $.win;

$.win.open();
