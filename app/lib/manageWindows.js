/*
 * MANAGE WINDOW
 * MANAGE THE WINDOWS DEPENDING ON THE PLATFORM USED. 
 * PARAMETERS: 
 * 
 * ARGS: ARGS PASSED TO NEW WINDOW
 * 
 * TYPE OF WINDOWS:
 * 	MAIN: WINDOWS THAT BELONGS TO THE MAIN MENU (SLIDE MENU)
 * 	NAVIGATIONWINDOW: WINDOWS OPENED IN STACK
 *  MODAL: MODAL WINDOWS
 */

// TODO: EXAMINE THE POSIBILITY OF EXPORT THREE DIFFERENT FUNCTIONS (OPENMAINWIN, OPENNAVIGATIONWIN, OPENMODALWIN) INSTEAD OF USING TYPEOFWINDOW ARGUMENT.
// TODO: EXAMINE PERFORMANCE ON SEVERAL DEVICES (AVAILABLE MEMORY)



exports.openWin = function(args, typeOfWindow){

if(typeOfWindow === 'main'){

	Ti.API.info('Main window open');
	
	Alloy.Globals.currentSection = args.name;
	
	if(OS_ANDROID){		
	
			var win=Alloy.createController(args.controller,args).getView();	
			
			win.addEventListener('open',function(e){
				
	    
			});
			
			win.addEventListener('android:back', function(e) {
			
			var dlg = Ti.UI.createAlertDialog({ message : L('exit'), buttonNames : [L('ok'),L('cancel')]});
				
				dlg.addEventListener("click", function(e) {
							
					if (e.index === 0) {
						
						win.close();			
						var activity = Titanium.Android.currentActivity;
						activity.finish();
					 			 	
					};
				            
				});
				
				dlg.show();
	
			});
	            
			win.open({
				activityEnterAnimation : (Alloy.isTablet) ? Ti.App.Android.R.anim.slide_in_right_tablet :  Ti.App.Android.R.anim.slide_in_right,
       			activityExitAnimation: Ti.App.Android.R.anim.out_no_change
			});
			
			Alloy.Globals.isMenuVisible = false;
			
			setTimeout(function(e) {
				
				if(Alloy.Globals.navGroup != null){
					
					Ti.API.info('Deleting old window: '+ Alloy.Globals.navGroup);
					Alloy.Globals.navGroup.close();
					Alloy.Globals.navGroup=null;
				
				};
				Alloy.Globals.navGroup=win;
			}, 300);
	
	}else{
		
			Alloy.Globals.navGroup.setTintColor(Alloy.CFG.greenColor1); 	//Hides leftnavButton to avoid flick when changing window
			var win=Alloy.createController(args.controller,args).getView();

			win.leftNavButton = Alloy.createController('customViews/customMenuButton').getView();
			win.title = args.titleValue;
			Alloy.Globals.navGroup.openWindow(win, {animated:false});
			
			Alloy.Globals.navGroup.setTintColor('white');

	};
	
}else if(typeOfWindow === 'navigationWindow'){
	
	Ti.API.info('Navigation window opened');
	
	
	if(OS_ANDROID){		
	
			var win=Alloy.createController(args.controller,args).getView();	
			win.windowSoftInputMode= Titanium.UI.Android.SOFT_INPUT_STATE_HIDDEN;
			
			win.addEventListener('open',function(e){

	            actionBar = win.activity.actionBar;
	            
	            if (actionBar) {
	                actionBar.displayHomeAsUp=true;
	                actionBar.title = args.titleValue;
	               // actionBar.icon = "/images/menuBtn.png";
	                actionBar.setDisplayShowHomeEnabled(false);
	                actionBar.onHomeIconItemSelected = function() {
						
					 
						win.close({activityExitAnimation: Ti.Android.R.anim.slide_out_right});
						
	                };
	            }
	            win.activity.invalidateOptionsMenu();

			});
			
	     
			win.open({
				 activityEnterAnimation: Ti.Android.R.anim.slide_in_right,
				 activityExitAnimation: Ti.Android.R.anim.out_no_change
    			 
			});
			
	
	}else{
		
			
			var win=Alloy.createController(args.controller,args).getView();
			win.title = args.titleValue;
			Alloy.Globals.navGroup.openWindow(win, {animated:true});

	};
	
} else if(typeOfWindow === 'modalWindow'){
	
	Ti.API.info('Modal window opened');

	
	if(OS_ANDROID){		
	
			var win=Alloy.createController(args.controller,args).getView();	
			win.keepScreenOn=true;
			win.addEventListener('click',function(e){

				Ti.API.info('Window closed');
				win.close();
		
	    
			});

			win.open({modal:"true", theme:"Theme.NoActionBar",backgroundColor:"transparent"});

	}else{
			var win = Alloy.createController(args.controller,args).getView();
			
			win.add(Ti.UI.createView({backgroundColor:'black',opacity:0.5, zIndex:-1}));	//SIMULATE TRANSLUCID BACKGROUND
			
			win.addEventListener('click',function(e){
				Ti.API.info('Window closed');
				win.close();	    
			});
			
			win.open({ backgroundColor:"transparent"});
	};
	
};;
};