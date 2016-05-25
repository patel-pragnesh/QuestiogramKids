var Consts = require('gameUtils/Constants');
module.exports = { 
    "name": "TestDataQuestiogram",
    "version": "0.1",
    "style": {
      "assetsPath": "dataQuestiograms/testAssets/",
      "gameBackground": 'background.png',
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
            "Has sido secuestrado, pero has podido escapar...", 
            "Sin embargo, no sabes donde estás.",
            "Empieza averiguando la ciudad en la que estás para emprender el camino a casa"
          ]
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/city.png'
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
          "type": Consts.AREA_DESCRIPTION_FORMAT_STREET_VIEW,
          "position" : {
            "latitude": 48.859793,
            "longitude": 2.289601
          },
          "marker" : {
            "image": 'markerAlexResize.png',
            "latitude": 48.860108,
            "longitude": 2.289948
          }
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_NO_TIMER,
          "fileName": "placeMap"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT,
          "type": "",
          //"answers": ['2003/04', '2004/05', '2005/06'],
          "solution": 'paris'
        }
             
      },
      {
        "id": 2,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "textIntro": {
          "enabled": true,
          "texts": [
            "Bien hecho", 
            "Ahora, vamos a escapar de aquí!!"
          ]
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "louvre" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "placeMap"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_MAP,
          "type": "",
          "region": {
            "latitude":48.863405, "longitude":2.318554,
            "latitudeDelta":0.04, "longitudeDelta":0.04
          },
          "solution": {"Lat" : 48.860976, "Lon" : 2.336059}
        }
             
      },
      {
        "id": 3,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "textIntro": {
          "enabled": true,
          "texts": [
            "Aquí estaremos seguros por el momento...", 
            "Deberás hacerte pasar por un experto en arte... no dudes en tus respuestas!"
          ]
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/louvre.png',
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "tomaBastilla" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "date"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ["1780", "1788", "1789", "2015"],
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
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/louvre.png',
          "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "monaLisa", 
          "isHidden": true
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "eye"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["ml3", "ml2", "ml1"],
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
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/louvre.png',
          "usePrevious": true
          //"keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": true, 
          "fileName": "marsellesa.mp3"
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "marsellesa" 
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "speaker"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ["luisXV", "luisXVI", "napoleon"],
          "rightAnswer": 2
        }
             
      },
      {
        "id": 6,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "textIntro": {
          "enabled": true,
          "texts": [
            "Alguien nos sigue... será mejor que salgamos de aquí", 
            "Actúa con normalidad y no des el cante..."
          ]
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/city.png',
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_MAP,
          "keepUntilNextQuestion": true,
          "region": {
            "latitude":48.858918, "longitude":2.339258,
            "latitudeDelta":0.05, "longitudeDelta":0.05
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
          "answers": ["sena", "manzanares", "tamesis"],
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
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/louvre.png',
          "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_MAP,
          "usePreviousArea": true,
          "keepUntilNextQuestion": true,
          "region": {
            "latitude":48.886349, "longitude":2.343135,
            "latitudeDelta":0.05, "longitudeDelta":0.05
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
          "answers": ["buckingham", "almudena", "momatre", "notredam"],
          "rightAnswer": 2
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
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/louvre.png',
          "usePrevious": true
          //"keepUntilNextQuestion": true
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_MAP,
          "usePreviousArea": true,
          //"keepUntilNextQuestion": true,
          "region": {
            "latitude":48.873658, "longitude":2.295081,
            "latitudeDelta":0.05, "longitudeDelta":0.05
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
          "layout": Consts.AREA_RESOLUTION_LAYOUT_VERTICAL,
          "answers": ["alcala", "arcoTriunfo", "brandenburgo"],
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
        "textIntro": {
          "enabled": true,
          "texts": [
            "Tenemos otra oportunidad de camuflarnos entre la multitud...", 
            "Hazte pasar por un experto en fútbol y vete al estadio..."
          ]
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/soccer.png',
         // "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "torres"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "numShirt"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['7','8','9'],
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
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/soccer.png',
          "usePrevious": true,
          "keepUntilNextQuestion": true
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
        "id": 11,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "questionBackground":{
          "enabled": true,
         // "fileName": 'backgrounds/soccer.png',
          "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "italia"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "numberTrophy"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['2','3','4'],
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
        "questionBackground":{
          "enabled": true,
         // "fileName": 'backgrounds/soccer.png',
          "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "cRonaldo"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "card"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ['yellowCard','redCard','dobleYellowCard'],
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
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/soccer.png',
          "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_GIF,
          "fileName": "02_anim"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "whoIsGoalkeeper"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ['marino','keylor','jesusFernandez'],
          "rightAnswer": 1
        }
             
      },
      {
        "id": 14,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/soccer.png',
          "usePrevious": true,
          //"keepUntilNextQuestion": true
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
          "answers": ["flagSpain", "flagHolland", "flagUruguay", "flagGermany"],
          "solution": {"flagGermany" : "flagSpain", "flagHolland" : "flagUruguay"}
        }
             
      },
      {
        "id": 15,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "textIntro": {
          "enabled": true,
          "texts": [
            "Escápate con el público hasta una sala de conciertos cercana...", 
            "Demuestra tus conocimientos de Rock ó muere!"
          ]
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/concert.png',
         // "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "isStreamable": true,
          //"keepUntilNextQuestion": true,
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
        "id": 16,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/concert.png',
          "usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          "isStreamable": true,
          "keepUntilNextQuestion": true,
          "fileName": "http://a1016.phobos.apple.com/us/r1000/041/Video/76/15/54/mzm.nnyxhtbh..640x368.h264lc.u.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "disc"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_VISUAL,
          "answers": ['coverNightOpera', 'coverPinkFloyd', 'grr'],
          "rightAnswer": 0
        }
             
      },
      {
        "id": 17,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/concert.png',
          "usePrevious": true, 
          "keepUntilNextQuestion": true
        },
        "descriptionArea": {
          //"type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          //"isStreamable": true,
          "usePrevious": true,
          "keepUntilNextQuestion": true
          //"fileName": "http://a717.phobos.apple.com/us/r1000/030/Video3/v4/44/d8/fe/44d8fe49-ad99-ba3a-96af-f3bf2116baac/mzvf_5572871792549600048.640x464.h264lc.U.p.m4v"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "nameSong"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_SELECT,
          "type": Consts.AREA_RESOLUTION_TYPE_TEXT,
          "answers": ['One Vision', 'Basico', 'Bohemian Rhapsody'],
          "rightAnswer": 2
        }
             
      },
       {
        "id": 18,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/concert.png',
          "usePrevious": true, 
          "keepUntilNextQuestion": true
        },
        "descriptionArea": {
          //"type": Consts.AREA_DESCRIPTION_FORMAT_VIDEO,
          //"isStreamable": true,
          "usePrevious": true
          //"fileName": "http://a717.phobos.apple.com/us/r1000/030/Video3/v4/44/d8/fe/44d8fe49-ad99-ba3a-96af-f3bf2116baac/mzvf_5572871792549600048.640x464.h264lc.U.p.m4v"
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
        "id": 19,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/concert.png',
          "usePrevious": true, 
          "keepUntilNextQuestion": true
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
          "answers": ['Green Day', 'Foo fighters', 'Descendents'],
          "rightAnswer": 1
        }
             
      },
      {
        "id": 20,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/concert.png',
          "usePrevious": true, 
          "keepUntilNextQuestion": true
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
          "layout": Consts.AREA_RESOLUTION_LAYOUT_VERTICAL,
          "answers": ['true', 'false'],
          "rightAnswer": 0
        }
             
      },
      {
        "id": 21,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "questionBackground":{
          "enabled": true,
          //"fileName": 'backgrounds/concert.png',
          "usePrevious": true
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
             
      },
      {
        "id": 22,
        "score": 100,
        "textIntro": {
          "enabled": true,
          "texts": [
            "Buen concierto! Ahora es el momento de escapar que nadie te perseguirá!", 
            "Te han facilitado el número de teléfono de la persona que te sacará de aquí, pero te faltan tres números..",
            "Encuéntralos y llama!"
          ]
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/concert.png'//,
          //"usePrevious": true,
          //"keepUntilNextQuestion": true
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
          "type": Consts.AREA_DESCRIPTION_FORMAT_STREET_VIEW,
          "position" : {
            "latitude": 48.851203,
            "longitude": 2.418239
          }/*,
          "marker" : {
            "image": 'markerAlexResize.png',
            "latitude": 48.860108,
            "longitude": 2.289948
          }*/
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "catNumber"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT,
          "type": "",
          //"answers": ['2003/04', '2004/05', '2005/06'],
          "solution": '316'
        }
             
      }/*,
      {
        "id": 22,
        "score": 100,
        "time": {
          "enabled": false,
          "amount": 0
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "textIntro": {
          "enabled": true,
          "texts": [
            "Se terminó el concierto... un estraño hombrecillo se te acerca y te dice...", 
            "Si resuelves éstos acertijos, te llevo a tu casa"
          ]
        },
        "questionBackground":{
          "enabled": true,
          "fileName": 'backgrounds/logic.png',
          //"usePrevious": true,
          "keepUntilNextQuestion": true
        },
        "sound": {
          "enabled": false, 
          "fileName": ""
        },
        "descriptionArea": {
          "type": Consts.AREA_DESCRIPTION_FORMAT_JPG,
          "fileName": "maths01"
        },
        "typeQuestion": {
          "type": Consts.TYPE_QUESTION_ICON,
          "fileName": "value4"
        },
        "resolutionArea": {
          "behavior": Consts.AREA_RESOLUTION_BEHAVIOR_INPUT_TEXT,
          "type": "",
          //"answers": ['2003/04', '2004/05', '2005/06'],
          "solution": '120'
        }
      }*/
    ]
};