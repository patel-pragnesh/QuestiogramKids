var Consts = require('gameUtils/Constants');
module.exports = { 
    "name": "iTunes",
    "version": "0.1",
    "feedItunes": true,
    "style": {
      "assetsPath": "dataQuestiograms/rockQuiz/",
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
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "isStreamable": true,
          "fileName": "http://a717.phobos.apple.com/us/r1000/030/Video3/v4/44/d8/fe/44d8fe49-ad99-ba3a-96af-f3bf2116baac/mzvf_5572871792549600048.640x464.h264lc.U.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "speaker"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['Beautiful boy', 'Imagine', 'Give me something'],
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
          "fileName": "http://a1531.phobos.apple.com/us/r1000/020/Music/v4/36/3e/8c/363e8c26-983c-595e-eeb6-e39197366804/mzaf_8620860176771042455.plus.aac.p.m4a"
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "isStreamable": true,
          "fileName": "http://is5.mzstatic.com/image/thumb/Video/v4/4f/41/93/4f419341-0105-10ec-211e-465499221dac/source/600x600bb.jpg"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "speaker"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['I Want You', 'Yellow submarine', 'Yesterday'],
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
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "isStreamable": true,
          "fileName": "http://a1016.phobos.apple.com/us/r1000/041/Video/76/15/54/mzm.nnyxhtbh..640x368.h264lc.u.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "date"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['1962', '1984', '1975'],
          "rightAnswer": 2
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
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "isStreamable": true,
          "fileName": "http://a237.phobos.apple.com/us/r1000/035/Video/d7/3c/aa/mzm.pvcibjlu..640x448.h264lc.u.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "speaker"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['Everlong', 'White Limo', 'All my life'],
          "rightAnswer": 1
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
          "isStreamable": true,
          "fileName": "http://a1719.phobos.apple.com/us/r1000/154/Video/v4/f8/ff/96/f8ff96af-955b-e137-cd79-d4a81bbada11/mzvf_3886024106684958711.640x352.h264lc.U.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "speaker"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['Space Oddity', 'Blackstar', 'Under pressure'],
          "rightAnswer": 1
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
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "isStreamable": true,
          //"keepUntilNextQuestion": true,
          "fileName": "http://a1162.phobos.apple.com/us/r1000/049/Video/cd/ae/e5/mzm.cwbikurr..640x480.h264lc.u.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "grammy"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ['true', 'false'],
          "rightAnswer": 0
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
          //"usePreviousArea": true,
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "isStreamable": true,
          "fileName": "http://a1836.phobos.apple.com/us/r1000/005/Video2/v4/27/04/be/2704be5d-3cb9-cf57-f5b7-c9d760d5af81/mzvf_2331735888754093377.640x464.h264lc.U.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "speaker"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ['someGirls', 'grr', 'voodoo'],
          "rightAnswer": 0
        }
             
      }

    ]
};