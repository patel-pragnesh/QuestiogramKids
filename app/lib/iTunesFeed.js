var QUERY_SEARCH = 'https://itunes.apple.com/search?term=';
var QUERY_LOOKUP = 'https://itunes.apple.com/lookup?id=';
var QUERY_LIMIT = 15;
var ITUNES_TYPE_ALBUM = '&entity=album';
var ITUNES_TYPE_SONG = '&entity=song';
var ITUNES_TYPE_MUSIC_VIDEO = '&entity=musicVideo';

exports.getSearchData = function(searchString, callback) {
	
	var url = parseQuery(searchString);

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {

			try {
				var data = JSON.parse(this.responseText);
			} catch(err) {
				Ti.API.info(JSON.stringify(err))
				var data = {
					error : 'Not valid JSON data'
				};
			}

			if (callback) {
				callback(data);
			}
		},

		onerror : function(e) {
			Ti.API.debug(e.error);
			alert('error');
		},
		timeout : 10000 // in milliseconds
	});

	client.open("GET", url);
	client.send();

}

exports.getLookUpData = function(params) {
	
	var params = params || {};

	var url = params.query;

	url += '&limit=' + QUERY_LIMIT;

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			
			Ti.API.info("Received text: " + this.responseText);

			try {
				var data = JSON.parse(this.responseText);
			} catch(err) {
				Ti.API.info(JSON.stringify(err))
				var data = {
					error : 'Not valid JSON data'
				};
			}

			params.onComplete && params.onComplete(data);
		},

		onerror : function(e) {
			Ti.API.debug(e.error);
			alert('error');
		},
		timeout : 10000 // in milliseconds
	});

	client.open("GET", url);
	client.send();

}

function parseQuery(query) {

	var query = query.toLowerCase();
	
	query = 'https://itunes.apple.com/search?term=' + encodeURIComponent(query);
	
	query +=  '&media=music'

	query += '&entity=musicArtist'
	
	query += '&limit=' + QUERY_LIMIT;  // máx. documentado por apple: 200, aunque a veces admite 500
	
	return query;
	
}

exports.get_media = function(url, cb) {
  var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			cb && cb(this.responseData);
		},
		onerror: function(e) {
			// this function is called when an error occurs, including a timeout
			console.log('error '+ url);
			cb && cb();
		},
		timeout: 5000
		/* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send(); // request is actually sent with this statement
};



exports.QUERY_SEARCH = QUERY_SEARCH;
exports.QUERY_LOOKUP = QUERY_LOOKUP;
exports.QUERY_LIMIT = QUERY_LIMIT;
exports.ITUNES_TYPE_ALBUM = ITUNES_TYPE_ALBUM;
exports.ITUNES_TYPE_SONG = ITUNES_TYPE_SONG;