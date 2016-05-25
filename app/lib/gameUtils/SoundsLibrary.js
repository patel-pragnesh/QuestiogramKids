
var plasticine = require('Plasticine');
var Sound = plasticine.Sound;

var CH_QUESTIONS = 0, CH_FX = 1, CH_MUSIC = 2, CH_AMBIENT = 3;

var SOUNDS = {
	success: 'success.mp3',
	fail: 'fail.mp3'
};

var questionSound = null;

if(OS_ANDROID) {
	Sound.loadSounds();
} else if (OS_IOS) {
	Sound.loadSounds(SOUNDS);
}
module.exports = {

	playFxSuccess: function() {
		Sound.playFx('success', CH_FX);
	},
	playFxFail: function() {
		Sound.playFx('fail', CH_FX);
	},
	playOnTouchAnswer: function(success) {
		if (success) {
			Sound.playFx('success', CH_FX);
		} else {
			Sound.playFx('fail', CH_FX);
		};
	},
	loadQuestionSound: function(sound) {
		questionSound = Sound.load(sound);
	},

	playQuestionSound: function() {
		Sound.playLoop(questionSound, CH_QUESTIONS);
	},

	removeQuestionSound: function() {
		Sound.remove(questionSound, CH_QUESTIONS);
		questionSound = null;
	},

	hasQuestionSound: function() {
		return (questionSound != null);
	},

	enableMusic: function() {
		this.musicIsEnabled = true;
		Sound.setVolumeChannel(1, CH_MUSIC);
	},
	muteMusic: function() {
		this.stopMusic();
		Sound.setVolumeChannel(0, CH_MUSIC);
	},
	muteSound: function() {
		this.stopMusic();
		Sound.setVolumeChannel(0, CH_MUSIC);
		Sound.setVolumeChannel(0, CH_AMBIENT);
		Sound.setVolumeChannel(0, CH_MENU);
		Sound.setVolumeChannel(0, CH_FX);
		Sound.disableSound();
	},
	enableSound: function() {
		this.stopMusic();
		Sound.setVolumeChannel(1, CH_MUSIC);
		Sound.setVolumeChannel(1, CH_AMBIENT);
		Sound.setVolumeChannel(1, CH_MENU);
		Sound.setVolumeChannel(1, CH_FX);
		Sound.enableSound();
	}
};




