var Feed = require('iTunesFeed');
var Consts = require('gameUtils/Constants');
var dataQuestiogram;
var albumsLoaded = 0;
var currentCoverDownload = 0;
var cbAfterQuestiogramCreated;
var cbError;
var MIN_ALBUMS_QUESTIOGRAM = 11;

var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'iTunes_dir');
!cacheDir.exists() && cacheDir.createDirectory();


exports.getQuestiogram = function(params) {

	var params = params || {};
	var artistId = params.artistId;

	// Init all variables and objects:
	currentCoverDownload = 0;
	albumsLoaded = 0;

	dataQuestiogram = {
		amgArtistId: "",
		artistId: "",
		artistLinkUrl: "",
		artistName: "",
		albums: []
	};

	// Keep callbacks:
	cbAfterQuestiogramCreated = params.onComplete || function(){};
	cbError = params.onError || function(){};

	getAlbumsFromArtistId(artistId);

}

exports.getArtistId = function(params) {

	var query = params.query;

	Feed.getSearchData(query, function(evt) {
			params.onComplete(evt);
		}
	);
};

function getAlbumsFromArtistId(id) {

	var query = Feed.QUERY_LOOKUP + id;

	query +=  Feed.ITUNES_TYPE_ALBUM;

	Feed.getLookUpData({
		query: query, 
		onComplete: function(e) {
			registerAlbums(e);
		}
	});
};

function getSongsFromAlbum(id) {

	var query = Feed.QUERY_LOOKUP + id;

	query +=  Feed.ITUNES_TYPE_SONG;

	Feed.getLookUpData({
		query: query, 
		onComplete: function(e) {
			registerSongs(e);
		}
	});
};

function registerAlbums(data) {

	if (!data || !data.results || _.isEmpty(data) || data.results.length === 0){
		Ti.API.warn('No data from iTunesFeed');
		cbError();
		return;
	};

	if (data.results.length < MIN_ALBUMS_QUESTIOGRAM) {
		cbError();
		return;
	}

	var numResults = data.results.length; 

	// It seems first field keeps information about the artist:
	var artistInformation = data.results[0];

	dataQuestiogram["artistId"] = artistInformation.artistId;
	dataQuestiogram["artistLinkUrl"] = artistInformation.artistLinkUrl;
	dataQuestiogram["artistName"] = artistInformation.artistName;
	dataQuestiogram["artistId"] = artistInformation.artistId;

	// Get all albums of this artist:
	for (var i=1, len=data.results.length; i<len;i++) {
		var item = data.results[i];
		if (item.collectionType === "Album") {
			var dataAlbum = {
				id: i,
				collectionName: item.collectionName,
				collectionId: item.collectionId,
				releaseDate: item.releaseDate,
				artworkUrl100: item.artworkUrl100
			}
			dataQuestiogram.albums.push(dataAlbum);
			getSongsFromAlbum(item.collectionId);
		}
	}
}


function registerSongs(data) {

	if (!data || !data.results || _.isEmpty(data) || data.results.length === 0){
		Ti.API.warn('No data from iTunesFeed');
		return;
	};

	// It seems first field keeps information about the album;
	var infoAlbum = data.results[0];
	var album = _.findWhere(dataQuestiogram.albums, {collectionId: infoAlbum.collectionId});
	album["songs"] = [];

	// Get all songs of this album:
	for (var i=1, len=data.results.length; i<len;i++) {
		var item = data.results[i];

		if (item.isStreamable) {
			var dataSong = {
				trackName: item.trackName,
				previewUrl: item.previewUrl
			}
			album.songs.push(dataSong);
		}
	}

	albumsLoaded++;

	if (albumsLoaded === dataQuestiogram.albums.length) {
		Ti.API.warn(dataQuestiogram);
		downloadCoverAlbums();
	}
}

function downloadCoverAlbums() {

	var covers = [];

	for (var i=0, len=dataQuestiogram.albums.length; i<len;i++) {
		var str = dataQuestiogram.albums[i].artworkUrl100;
		// This is a non documented trick to get better images resolution:
		var res = str.replace("100x100", "400x400");
		covers.push(res);
	};

	var callback = function(media){

		var nameImage = new Date().getTime() +'.jpg';

		var storedImage = Ti.Filesystem.getFile(cacheDir.resolve(), nameImage);
		storedImage.write(media);

		dataQuestiogram.albums[currentCoverDownload]['cachedCoverImage'] = nameImage;
		
		currentCoverDownload++;

		if (currentCoverDownload < covers.length) {
			Feed.get_media(covers[currentCoverDownload], callback);
		} else {
			buildJson();
		}
	};

	Feed.get_media(covers[currentCoverDownload], callback);
}



// A temporary way to build the questiogram
function buildJson() {

	var questiogram = { 
	    "name": "Itunes",
	    "version": "0.1",
	    "feedItunes": true,
	    "style": {
	      "assetsPath": "dataQuestiograms/iTunes/",
	      "cacheDir": cacheDir,
	      "gameBackground": 'background.png',
	      "descriptionBackground": 'descriptionBackground.png',
	      "descriptionTitle": dataQuestiogram.artistName,
	      "boxTextAnswer": 'boxTextAnswer.png'
	    },
	    "questions" : [
	      {
	        "id": 1,
	        "score": 100,
	        "time": {
	          "enabled": false,
	          "amount": 0
	        },
	        "sound": {
	          "enabled": true, 
	          "fileName": dataQuestiogram.albums[0].songs[0].previewUrl
	        },
	        "descriptionArea": {
	          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
	          "fileName": "" 
	        },
	        "typeQuestion": {
	          "type": Consts.TYPE_QUESTION_ICON,
	          "fileName": "speaker"
	        },
	        "resolutionArea": {
	          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
	          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
	          "cachedImages": true,
	          "answers": [dataQuestiogram.albums[0].cachedCoverImage, dataQuestiogram.albums[1].cachedCoverImage, dataQuestiogram.albums[2].cachedCoverImage],
	          "rightAnswer": 0
	        }
	      },
	      {
	        "id": 2,
	        "score": 100,
	        "itunesFeed": {
	          "enabled": true,
	          "query": 'Green day'
	        },
	        "time": {
	          "enabled": false,
	          "amount": 0
	        },
	        "sound": {
	          "enabled": true, 
	          "fileName": dataQuestiogram.albums[1].songs[0].previewUrl
	        },
	        "descriptionArea": {
	          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
	          "fileName": "" 
	        },
	        "typeQuestion": {
	          "type": Consts.TYPE_QUESTION_ICON,
	          "fileName": "speaker"
	        },
	        "resolutionArea": {
	          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
	          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
	          "cachedImages": true,
	          "answers": [dataQuestiogram.albums[5].cachedCoverImage, dataQuestiogram.albums[3].cachedCoverImage, dataQuestiogram.albums[1].cachedCoverImage],
	          "rightAnswer": 2
	        }
	      },
	      {
	        "id": 3,
	        "score": 100,
	        "itunesFeed": {
	          "enabled": true,
	          "query": 'Green day'
	        },
	        "time": {
	          "enabled": false,
	          "amount": 0
	        },
	        "sound": {
	          "enabled": true, 
	          "fileName": dataQuestiogram.albums[3].songs[0].previewUrl
	        },
	        "descriptionArea": {
	          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
	          "fileName": "" 
	        },
	        "typeQuestion": {
	          "type": Consts.TYPE_QUESTION_ICON,
	          "fileName": "speaker"
	        },
	        "resolutionArea": {
	          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
	          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
	          "cachedImages": true,
	          "answers": [dataQuestiogram.albums[2].songs[2].trackName, dataQuestiogram.albums[3].songs[0].trackName, dataQuestiogram.albums[3].songs[1].trackName],
	          "rightAnswer": 1
	        }
	      },
	      {
	        "id": 4,
	        "score": 100,
	        "time": {
	          "enabled": false,
	          "amount": 0
	        },
	        "sound": {
	          "enabled": true, 
	          "fileName": dataQuestiogram.albums[3].songs[3].previewUrl
	        },
	        "descriptionArea": {
	          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
	          "fileName": "" 
	        },
	        "typeQuestion": {
	          "type": Consts.TYPE_QUESTION_ICON,
	          "fileName": "speaker"
	        },
	        "resolutionArea": {
	          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
	          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
	          "cachedImages": true,
	          "answers": [dataQuestiogram.albums[5].songs[0].trackName, 
	          				dataQuestiogram.albums[4].songs[0].trackName, 
	          				dataQuestiogram.albums[3].songs[0].trackName,
	          				dataQuestiogram.albums[1].songs[0].trackName,
	          				dataQuestiogram.albums[2].songs[2].trackName],
	          "rightAnswer": 2
	        }
	       },
	       {
	        "id": 5,
	        "score": 100,
	        "time": {
	          "enabled": false,
	          "amount": 0
	        },
	        "sound": {
	          "enabled": true, 
	          "fileName": dataQuestiogram.albums[4].songs[3].previewUrl
	        },
	        "descriptionArea": {
	          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
	          "fileName": "" 
	        },
	        "typeQuestion": {
	          "type": Consts.TYPE_QUESTION_ICON,
	          "fileName": "speaker"
	        },
	        "resolutionArea": {
	          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
	          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
	          "cachedImages": true,
	          "answers": [dataQuestiogram.albums[4].cachedCoverImage, dataQuestiogram.albums[2].cachedCoverImage, dataQuestiogram.albums[6].cachedCoverImage, dataQuestiogram.albums[3].cachedCoverImage],
	          "rightAnswer": 0
	        }
	    }
	      
	    ]
   	};

   	cbAfterQuestiogramCreated(questiogram);
}
