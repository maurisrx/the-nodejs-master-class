/**
 * Primary API file
 */
// Dependancies
var http = require('http');
var url = require('url');
var {StringDecoder} = require('string_decoder');

var httpServer = http.createServer(function(req, res){
	var parsedUrl = url.parse(req.url, true);

	var path = parsedUrl.pathname;
	var trimmedPath = path.replace( /^\/+|\/+$/g, '');

	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data', function(data) {
		buffer += decoder.write(data);
	});

	req.on('end', function() {
		var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		choosenHandler(function(statusCode, payload) {
			var statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			var payload = typeof(payload) == 'object' ? payload : {};

			var payloadString = JSON.stringify(payload);

			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			console.log('Returning this response: ' + statusCode, payloadString);
		});

	});
});

httpServer.listen(1000, function(){
	console.log('The server is up and listening to port 1000.');
});

var handlers = {};

handlers.hello = function(callback) {
	callback(200, {'message': 'Welcome to Assignment 1 of The NodeJS Master Class!'});
};

handlers.notFound = function(callback) {
	callback(404);
};

var router = {
	'hello': handlers.hello
};