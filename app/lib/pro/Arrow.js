

var Cloud = require('ti.cloud');
Cloud.debug = true;  // optional; if you add this line, set it to false for production

var userAuthenticated = false;
var userId;
var sessionId;

// TODO: Make Comments!

function createUserFromGameCenter(player, callback){

	Cloud.Users.create({

	    username: player.alias,				// Need to encrypt?
	    password: player.id,				// Need to encrypt?
	    password_confirmation: player.id,
	    first_name: player.alias,
	    last_name: ''

	}, function (e) {

	    if (e.success) {
	        
	        Ti.API.info('userCreated' + JSON.stringify(e));
	        userAuthenticated = true;
	        userId = e.id;
	        sessionId = e.session_id;

	       
	    };
	    
	    callback(e);

	});

};

exports.createUserFromGameCenter = createUserFromGameCenter;

function logInUserFromGameCenter(player, callback){

	Cloud.Users.login({
	    login: player.alias,
	    password: player.id

	}, function (e) {

	    if (e.success) {

	        var user = e.users[0];
	        userAuthenticated = true;
	        userId = user.id;
	        sessionId = Cloud.sessionId;	       

	    };

	    callback(e);
	     

	});

};


exports.logInUserFromGameCenter = logInUserFromGameCenter;

function createDataProgressForGameCenterUser(data,callback) {

	Cloud.Files.create({
        name: 'gameData',
        file: data
    }, function (e) {
       
       callback(e); 

    });

};

exports.createDataProgressForGameCenterUser = createDataProgressForGameCenterUser;

function retrieveDataProgressForGameCenterUser(nameData, callback) {

	// TODO: Handle onstream events, showing an activity indicator. 

	Cloud.Files.query({

	    where: {user_id:userId, name:nameData},

	}, function (e) {
	    if (e.success) {
	        
	        var myData = e.files[0];

	        Cloud.Files.show({
			    file_id: myData.id,
			    pretty_json:true
			}, function (e) {
			    if (e.success) {
			        var file = e.files[0];

			        var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, file.name);

			        var data = null;

			        var xhr = Titanium.Network.createHTTPClient({      

			        	onload: function() {

			        		if (f.write(this.responseData) === false) {

			        			Ti.API.info('Problem accessing the file');

			        		} else {

			        			Ti.API.info('File saved in: ' + f.resolve());


			        				data = this.responseData;
			        				
			        		}

			        		callback(e,data);

			        	},


			        	onerror: function () {

			        		alert('Problem loading the file, no data access. Try later!');
                   
                   			data = null;

                   			callback(e,data);
			        	},

			        	timeout: 10000
			        });


			        xhr.open('GET', file.url);
            		xhr.send();
			        /*
			        alert(JSON.stringify(file));
			        alert('Success:\n' +
			            'id: ' + file.id + '\n' +
			            'name: ' + file.name + '\n' +
			            'updated_at: ' + file.updated_at);
*/
			    } else {
			        alert('Error:\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});


	    } else {
	        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});

	
	


};

exports.retrieveDataProgressForGameCenterUser = retrieveDataProgressForGameCenterUser;



