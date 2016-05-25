/*
* SOUND MODULE BY arayon_
* Check AlmixerNotes.pdf for more info
*/

var platino = require('io.platino');
var ALmixer = platino.require('co.lanica.almixer');

// loadedSounds will keep the sound buffered in memory:
var loadedSounds = {};

// Default channels, 1 for music, 2 for FX.
var CH_MUSIC = 1;
var CH_FX = 2;

// Init audio system (@params from Alloy.CFG.sound)
// Frequency: Supported values are 11025, 22050, 44100. Passing 0 will pick a default (or try to defer to the vendor for the best value). 
// Other values are not tested.
// num_channels. Will let you change the maximum for ALmixer, but things will fail if you exceed the operating system maximum 
// (Usually 32). Passing 0 will pick a default 
exports.init = function() {

	!Alloy.CFG.sound && Ti.API.error('core/Sound.js: Alloy.CFG.sound config not found.');

	Alloy.CFG.sound = Alloy.CFG.sound || {};
	var freq = Alloy.CFG.sound.frequency || 0;
	var numChannels = Alloy.CFG.sound.numChannels || 4;

	//Use ALmixer.ReserveChannels() to block off certain channels from being auto-allocated.
	//ALmixer.ReserveChannels(2);
	ALmixer.Init(freq, numChannels, 0);
}

 // Load sounds in buffer (@params from Alloy.CFG.sound)
exports.loadSounds = function() {
	var files = Alloy.CFG.sound.files || [];
	_.each(files, function(sound){
		loadedSounds[sound.name] = ALmixer.LoadAll('sounds/' + sound.url);
	});
}

exports.load = function(sound) {
	var s = ALmixer.LoadAll(sound);
	return s;
}

exports.playLoop = function(sound, channel) {
	ALmixer.PlayChannel(channel, sound, -1);
}

// Play music on channel 0, and make it loop infinitely (the last parameter of -1)
exports.remove = function(sound, channel) {
	ALmixer.HaltChannel(channel);
	ALmixer.FreeData(sound);
}

// Play music on channel 0, and make it loop infinitely (the last parameter of -1)
exports.playMusic = function(sound) {
	ALmixer.PlayChannel(CH_MUSIC, loadedSounds[sound], -1);
}

// This will play the sound on any available channel (first parameter of -1) and don’t loop (last parameter of 0)
exports.playFx = function(sound, channel) {
	ALmixer.HaltChannel(channel);
	ALmixer.PlayChannel(channel, loadedSounds[sound], 0);
}

// Set volume for Music Channel (0 to 1)
exports.setVolumeMusic = function(value) {
	ALmixer.SetVolumeChannel(CH_MUSIC, value);
}

// Set volume for Fx Channel (0 to 1)
exports.setVolumeFx = function(value) {
	ALmixer.SetVolumeChannel(CH_FX, value);
}

// Set global volume
exports.setVolumeGlobal = function(value){
	ALmixer.SetVolumeChannel(CH_MUSIC,value);
	ALmixer.SetVolumeChannel(CH_FX,value);
}

// Stops the current music in channel 
exports.stopMusic = function(sound){
	ALmixer.HaltChannel(CH_MUSIC);
}

// Stops the current FX in channel 
exports.stop = function(channel){
	ALmixer.HaltChannel(channel);
}

// Methods used in order to free memory. Usually used when closing the game

exports.free = function(sound){
	ALmixer.FreeData(sound);
	sound = null;
}

exports.freeAll = function(){

	ALmixer.HaltChannel(1);
	ALmixer.HaltChannel(2);

	if(loadedSounds != null){
		_.each(loadedSounds, function(sound){

			if(sound != null){
				ALmixer.FreeData(sound);
				sound = null;
			};

		});
		
		loadedSounds = null;
	};
}

// Audio “Interruptions”:
exports.quit = ALmixer.Quit;
exports.EndInterruption = ALmixer.EndInterruption;
exports.BeginInterruption = ALmixer.BeginInterruption;

