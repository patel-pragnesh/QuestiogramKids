//var Consts = require('gameUtils/Constants');

function init(params) {
	dataQuestions = require(params.data);
	exports.style = dataQuestions.style;
}

function getQuestion(id) {
	var params = params || {};
	return readQuestion(id);
}

function isValidQuestion(id) {
	return !_.isEmpty(readQuestion(id));
}

function readQuestion(id) {
	var questions = dataQuestions.questions;

	var data = {};
	for (var i = 0, len = questions.length; i < len; i++) {
		if (questions[i].id == id) {
			data = questions[i];
			break;
		}	
	}

	return data;
}

function getAllQuestions() {
	return dataQuestions.questions;
}

function getAssetsPath() {
	return dataQuestions.assetsPath;
}

function getStyle() {
	return dataQuestions.style;
}

function getBackgroundImage() {
	return dataQuestions.assetsPath + dataQuestions.style.backgroundImage;
}

exports.init = init;
exports.getQuestion = getQuestion;
exports.isValidQuestion = isValidQuestion;
exports.getAllQuestions = getAllQuestions;
exports.getAssetsPath = getAssetsPath;
exports.getBackgroundImage = getBackgroundImage;
