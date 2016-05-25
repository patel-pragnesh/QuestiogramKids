var Consts = require('gameUtils/Constants');
module.exports = { 
    "name": "TestDataQuestiogram",
    "version": "0.1",
    "style": {
      "assetsPath": "dataQuestiograms/testQuestiogram/",
      "gameBackground": 'background.png',
      "descriptionBackground": 'descriptionBackground.png',
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
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "1"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "date"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['2003/04', '2004/05', '2005/06'],
          "rightAnswer": 1
        }
             
      },
      {
        "id": 2,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_GIF,
          "fileName": "01_anim"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "finalAction"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ['ballStopped','goal','postGoal'],
          "rightAnswer": 0
        }
             
      },
      {
        "id": 3,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": true, 
          "fileName": "sound.mp3"
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "3" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "speaker"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["chicken", "cow", "duck", "horse"],
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
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "4", 
          "isHidden": true
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "eye"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["circle1", "circle2", "circle3", "circle4"],
          "rightAnswer": 0
        }
             
      },
      {
        "id": 6,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "5" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "matches"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_JOIN,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["flagSpain", "flagHolland", "flagUruguay", "flagGermany", "flagCzech"],
          "solution": {"flagGermany" : "flagSpain", "flagHolland" : "flagUruguay"}
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
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "fileName": "tutorial04.mp4"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "date"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['2003/04', '2004/05', '2005/06'],
          "rightAnswer": 1
        }
             
      },
       {
        "id": 7,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "2" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "placeMap"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_MAP,
          "type": "",
          "solution": {"Lat" : 41.6525, "Lon" : -4.72473}
        }
             
      },
      {
        "id": 8,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_MAP,
          "keepUntilNextQuestion": true,
          "region": {
            "latitude":40.424803, "longitude":-3.691904,
            "latitudeDelta":6, "longitudeDelta":6
          },
          "annotation" : {
            //"latitude": 40.424803,
            //"longitude": -3.691904,
            "title": 'Sydney Opera House',
            "subtitle": 'Sydney, New South Wales, Australia',
          },
          "fileName": "2" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "placeMap"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "layout": Consts.AREA_RESOLUTION_LAYOUT_VERTICAL,
          "answers": ["brandenburgo", "alcala", "eiffel"],
          "rightAnswer": 1
        }
             
      },
      {
        "id": 9,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_MAP,
          "usePreviousArea": true,
          "keepUntilNextQuestion": true,
          "region": {
            "latitude":41.623100, "longitude":-4.718148,
            "latitudeDelta":6, "longitudeDelta":6
          },
          "annotation" : {
            //"latitude": 40.427903,
            //"longitude": -3.691904,
            "title": 'Sydney Opera House 2 ',
            "subtitle": 'Sydney, New South Wales, Australia 2 ',
          },
          "fileName": "2" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "placeMap"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "layout": Consts.AREA_RESOLUTION_LAYOUT_HORIZONTAL,
          "answers": ["gazpacho", "paella", "lechazo"],
          "rightAnswer": 2
        }
             
      },
      {
        "id": 10,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_MAP,
          "usePreviousArea": true,
          "keepUntilNextQuestion": true,
          "region": {
            "latitude":42.599813, "longitude":-5.566925,
            "latitudeDelta":6, "longitudeDelta":6
          },
          "annotation" : {
            //"latitude": 40.427903,
            //"longitude": -3.691904,
            "title": 'Sydney Opera House 2 ',
            "subtitle": 'Sydney, New South Wales, Australia 2 ',
          },
          "fileName": "2" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "placeMap"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "layout": Consts.AREA_RESOLUTION_LAYOUT_HORIZONTAL,
          "answers": ["leon", "jaen", "sevilla"],
          "rightAnswer": 0
        }
             
      },
      {
        "id": 11,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_MAP,
          "usePreviousArea": true,
          "region": {
            "latitude":43.531693, "longitude":-5.661343,
            "latitudeDelta":6, "longitudeDelta":6
          },
          "zoomInOnEnd":true,
          "annotation" : {
            //"latitude": 40.427903,
            //"longitude": -3.691904,
            "title": 'Sydney Opera House 2 ',
            "subtitle": 'Sydney, New South Wales, Australia 2 ',
          },
          "fileName": "2" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "placeMap"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "layout": Consts.AREA_RESOLUTION_LAYOUT_VERTICAL,
          "answers": ["playaDonosti", "playaBenidorm", "playaGijon"],
          "rightAnswer": 2
        }
             
      },
      {
        "id": 12,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_STREET_VIEW,
          "position" : {
            "latitude": 48.85981398293689,
            "longitude": 2.289430462934348
          }
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_NONE,
          "fileName": "date"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['2003/04', '2004/05', '2005/06'],
          "rightAnswer": 1
        }
             
      },
      {
        "id": 13,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "fileName": "tutorial04.mp4"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "date"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['2003/04', '2004/05', '2005/06'],
          "rightAnswer": 1
        }
             
      }
    ]
};