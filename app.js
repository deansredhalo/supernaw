var fs = require('fs');
var protagonist = require('protagonist');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model;
var app = express();
var router = express.Router();

// declare our global variables
var inputFile = 'apis/test2.md';
var responses = [];
var responseModels = [];
var createdSchemas = [];
var fileData;

var Supernaw = function(file) {
	this.readFile(file);
}

Supernaw.prototype.declareRoutes = function(items) {

	for (var i = 0; i < items.length; i++) {
		var item = items[i];

		var tmpModel = module.exports.base.models[item.title].modelName;

		if (item.title === tmpModel) {
			var the_model = module.exports;

			console.log(the_model);

			if (item.method == 'GET') {
				router.route(item.path).get(function(req, res) {

					the_model.find(function(err, returns) {
						if (err) {
							return res.send(err);
						}
						res.json(returns);
					});
				});
			}
			else if (item.method == 'POST') {
				router.route(item.path).post(function(req, res) {
					var tmpItem = module.exports.base.models[item.title](req.body);

					tmpItem.save(function(err) {
						if (err) {
							return res.send(err);
						}
					 
						res.send({ message: 'Item Added' });
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

			for (key in model.body) {
				tmpObj[key] = model.body[key];
			}
		}

		for (key in tmpObj) {
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

		for (key in response.model) {
			var item = response.model[key];
			if (typeof item === 'string') {
				item = item.replace(/(\r\n|\n|\r)/gm,"");
			}
		}

		for (key in response.responses) {
			var item = response.responses[key];
			if (typeof item === 'string') {
				item = item.replace(/(\r\n|\n|\r)/gm,"");
			}
		}

		responseModels.push(
			{
				"title": response.name,
				"body": JSON.parse(response.model.body),
				"method": response.method,
				"path": response.path
			}
		);

	}

	supernaw.declareSchemas(responseModels);
}

Supernaw.prototype.parseFile = function(file) {

	protagonist.parse(file, function(error, result) {
		
		if (error) {
			console.log(error);
			return;
		}

		resultJSON = result.ast;
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

var dbName = 'supernaw';
var connectionString = 'mongodb://localhost:27017/' + dbName;
 
mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/', router);

module.exports = app;