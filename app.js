#!/usr/bin/env node

'use strict';

var fs = require('fs');
var minimist = require('minimist');
var protagonist = require('protagonist');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongojs = require('mongojs');
var app = express();
var router = express.Router();

var args = minimist(process.argv.slice(2));
var fileName = args._[0];

// declare our global variables
var inputFile = fileName;
var responses = [];
var responseModels = [];
var createdSchemas = [];
var fileData;

var databaseUrl = "supernaw";
var collections = ["mycollection"]
var db = mongojs.connect(databaseUrl, collections);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use('/', router);

var Supernaw = function(file) {
	this.readFile(file);
}

Supernaw.prototype.declareRoutes = function(items) {

	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		var tmpModel = module.exports.base.models[item.title].modelName;

		if (item.title === tmpModel) {

			if (item.method == 'GET') {

				if (item.path.indexOf(':') === -1) {
					router.route(item.path).get(function(req, res) {

						db.mycollection.find(function(err, returns) {
							if (err) {
								return res.send(err);
							}
							res.json(returns);
						});
					});
				}
				else {
					router.route(item.path).get(function(req, res) {

						var id = req.url.split('/')[2];

						db.mycollection.findOne({ _id: mongojs.ObjectId(id) }, function(err, returns) {
							if (err) {
								return res.send(err);
							}
							res.json(returns);
						});
					});
				}
			}
			else if (item.method == 'POST') {
				router.route(item.path).post(function(req, res) {
					req.headers['content-type'] = 'application/json; charset=utf-8';

					db.mycollection.save(req.body, function() {
						res.send({ message: 'Item Added', _id: req.body._id });
					});

				});
			}
			else if (item.method == 'PUT') {
				router.route(item.path).put(function(req, res) {
					req.headers['content-type'] = 'application/json; charset=utf-8';

					var id = req.url.split('/')[2];
					var update = req.body;

					db.mycollection.update({ _id: mongojs.ObjectId(id) }, { $set: update }, function() {
						res.send({ message: 'Item Updated', _id: mongojs.ObjectId(id) });
					});

				});
			}
			else if (item.method == 'DELETE') {
				router.route(item.path).delete(function(req, res) {
					req.headers['content-type'] = 'application/json; charset=utf-8';

					var id = req.url.split('/')[2];

					db.mycollection.remove({ _id: mongojs.ObjectId(id) }, function() {
						res.send({ message: 'Item Deleted', , _id: mongojs.ObjectId(id) });
					});

				});
			}
		}
	}
}

Supernaw.prototype.declareSchemas = function(models) {

	var tmpObj = {};
	var schemaObj = {};

	for (var i = 0; i < models.length; i++) {
		var model = models[i];

		tmpObj['title'] = model.title;

		if (model.method == 'POST') {

			for (var key in model.body) {
				tmpObj[key] = model.body[key];
			}
		}

		for (var key in tmpObj) {
			schemaObj[key] = (typeof tmpObj[key]);
		}

		var mongooseSchema = new Schema(schemaObj);

		createdSchemas.push(mongooseSchema);

		module.exports = mongoose.model(tmpObj['title'], mongooseSchema);
	}

	supernaw.declareRoutes(models);

}

Supernaw.prototype.walkBlueprint = function(fileObject) {

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
							"name": action.name,
							"method": action.method,
							"path": path,
							"model": resource.model,
							"responses": example.responses 
						}
					);
				}
			}
		}
	}

	for (var x = 0; x < responses.length; x++) {
		var response = responses[x];

		response.name = response.name.replace(/(\r\n|\n|\r)/gm,"");
		response.method = response.method.replace(/(\r\n|\n|\r)/gm,"");
		response.path = response.path.replace(/(\r\n|\n|\r)/gm,"");

		for (var key in response.model) {
			var item = response.model[key];
			if (typeof item === 'string') {
				item = item.replace(/(\r\n|\n|\r)/gm,"");
			}
		}

		for (var key in response.responses) {
			var item = response.responses[key];
			if (typeof item === 'string') {
				item = item.replace(/(\r\n|\n|\r)/gm,"");
			}
		}

		if (response.model.body != undefined) {

			responseModels.push(
				{
					"title": response.name,
					"body": JSON.parse(response.model.body),
					"method": response.method,
					"path": response.path
				}
			);
		}
	}

	supernaw.declareSchemas(responseModels);
}

Supernaw.prototype.parseFile = function(file) {

	protagonist.parse(file, function(error, result) {
		
		if (error) {
			console.log(error);
			return;
		}

		var resultJSON = result.ast;
		supernaw.walkBlueprint(resultJSON);

	});

}

Supernaw.prototype.readFile = function(file) {
	try {
		var fileData = fs.readFileSync(file, 'utf8');
		this.parseFile(fileData);
	} 
	catch (error) {
		throw error;
	}
}

var supernaw = new Supernaw(inputFile);

app.set('port', process.env.PORT || 1993);

var server = app.listen(app.get('port'), function() {
	console.log("You know the lady's a lot like Reno...Supernaw is running on port " + server.address().port);
});

module.exports = app;