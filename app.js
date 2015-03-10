var fs = require('fs');
var protagonist = require('protagonist');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var models = require('./models/model');
var app = express();

// declare our global variables
var inputFile = 'apis/test.md';
var responses = [];
var fileData;

function walkBlueprint(fileObject) {

	var resourceGroups = fileObject.resourceGroups;

	for (var i = 0; i < resourceGroups.length; i++) {
		var resources = resourceGroups[i]['resources'];

		for (var j = 0; j < resources.length; j++) {
			var resource = resources[j];

			if (resource['uriTemplate'] != null) {
				var path = resource['uriTemplate'].split('{?')[0].replace(new RegExp("}","g"), "").replace(new RegExp("{","g"), ":");
			}

			var actions = resource['actions'];

			for (var l = 0; l < actions.length; l++) {
				var action = actions[l];

				for (var k = 0; k < action['examples'].length; k++) {
					var example = action['examples'][k];

					responses.push( 
						{
							"method": action.method,
							"path": path,
							"model": resource.model,
							"responses": example.responses 
						}
					);

					console.log(responses);
				}
			}
		}
	}
}

function parseFile(file) {

	protagonist.parse(file, function(error, result) {
		
		if (error) {
			console.log(error);
			return;
		}

		resultJSON = result.ast;
		walkBlueprint(resultJSON);

	});

}

function readFile(file) {
	try {
		var fileData = fs.readFileSync(file, 'utf8');
		parseFile(fileData);
	} 
	catch (error) {
		throw error;
	}
}

readFile(inputFile);
console.log(responses);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// app.use('/api', models);

module.exports = app;