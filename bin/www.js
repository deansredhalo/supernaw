var app = require('../app');

app.set('port', process.env.PORT || 1993);

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});