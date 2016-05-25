var Consts = require('gameUtils/Constants');
module.exports = { 
    "name": "iTunes",
    "version": "0.1",
    "feedItunes": true,
    "style": {
      "assetsPath": "dataQuestiograms/kids/",
      "gameBackground": 'background.png',
      "descriptionBackground": 'descriptionBackground.png',
      "boxTextAnswer": 'boxTextAnswer.png'
    },
    "questions" : [
      {
        "id": 1,
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
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "description_cow" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "icon_animal_food"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL_ITUNES,
          "itunesFeed": true,
          "answers": [],
          "rightAnswer": 2
        }
      },
      {
        "id": 2,
        "score": 100,
        "itunesFeed": {
          "enabled": true,
          "query": 'Queen'
        },
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
          "fileName": "description_cow" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "icon_animal_food"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL_ITUNES,
          "itunesFeed": true,
          "answers": [],
          "rightAnswer": 2
        }
      },
      {
        "id": 3,
        "score": 100,
        "itunesFeed": {
          "enabled": true,
          "query": 'Red hot chili peppers'
        },
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
          "fileName": "description_cow" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "icon_animal_food"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL_ITUNES,
          "itunesFeed": true,
          "answers": [],
          "rightAnswer": 2
        }
      }

    ]
};