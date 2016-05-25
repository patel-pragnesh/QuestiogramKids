var Consts = require('gameUtils/Constants');
module.exports = { 
    "name": "Kids",
    "version": "0.1",
    "style": {
      "assetsPath": "dataQuestiograms/kids/",
      "gameBackground": 'background/sky.png',
      "descriptionBackground": 'descriptionBackground.png',
      "boxTextAnswer": 'boxTextAnswer.png'
    },
    "questions" : [
      {
        "id": 1,
        "score": 100,
        "textIntro": {
          "enabled": true,
          "texts": [
            "Kids Questiogram"
          ]
        },
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": true, 
          "fileName": "cow.mp3"
        },
        "descriptionArea": {
          "enabled": false
        },
        "mainItem": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_PNG,
          "fileName": "cow",
          "cover": Consts.MAIN_ITEM_COVER_BOX
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_NONE,
          "fileName": ""
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["buttonHeadPig", "hh", "buttonHeadRabbit"],
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
          "enabled": true, 
          "fileName": "pig.mp3"
        },
        "descriptionArea": {
          "enabled": false
        },
        "mainItem": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_PNG,
          "fileName": "pig",
          "cover": Consts.MAIN_ITEM_COVER_BOX
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_NONE,
          "fileName": ""
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["buttonHeadPig", "buttonHeadMouse"],
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
          "fileName": "chick.mp3"
        },
        "descriptionArea": {
          "enabled": false
        },
        "mainItem": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_PNG,
          "fileName": "chick",
          "cover": Consts.MAIN_ITEM_COVER_BOX
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_NONE,
          "fileName": ""
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["buttonHeadRabbit", "buttonHeadPig", "buttonHeadMouse","buttonHeadChick"],
          "rightAnswer": 3
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
          "fileName": "bee.mp3"
        },
        "descriptionArea": {
          "enabled": false
        },
        "mainItem": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_PNG,
          "fileName": "bee",
          "cover": Consts.MAIN_ITEM_COVER_BOX
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_NONE,
          "fileName": ""
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["hh", "buttonHeadRabbit", "buttonHeadMouse","buttonHeadBee"],
          "rightAnswer": 3
        }
      }

    ]
};