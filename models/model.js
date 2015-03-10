var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var protagonist = require('protagonist');

// var inputFile = 'apis/test.md';
// var resultJSON;

// try {
// 	var fileData = fs.readFileSync(inputFile, 'utf8');
// } 
// catch (error) {
// 	throw error;
// }

// protagonist.parse(fileData, function(error, result) {
    
//     if (error) {
//         console.log(error);
//         return;
//     }

//     resultJSON = result.ast;

//     console.log(result.JSON);

// });

// for (var key in resultJSON) {
// 	if (resultJSON.hasOwnProperty(key)) {
// 		console.log(key);
// 	}
// }
