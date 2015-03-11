#!/usr/bin/env node

var app = require('../app');

app.set('port', process.env.PORT || 1993);

var server = app.listen(app.get('port'), function() {
	console.log("You know the lady's a lot like Reno...Supernaw is running on port " + server.address().port);
});