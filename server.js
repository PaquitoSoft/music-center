var connect = require('connect'),
	fs = require('fs');

var SERVER_PORT = process.env.PORT || 3003;
var environment = process.env.NODE_ENV || 'local';

var filesPath = __dirname + '/dist';
var middleware = [];

if (environment !== 'production') {
	filesPath = __dirname;
	middleware.push(connect.logger('dev'));
}

middleware = middleware.concat([
	connect.compress(),
	connect.static(filesPath, {maxAge: 365 * 24 * 3600 * 1000}), // One year static content expiration
	function(req, res) {
		res.end('This is a static content server.');
	}
]);

var app = connect();
middleware.forEach(function(mid) {
	app.use(mid);
});

app.listen(SERVER_PORT, function() {
	console.log('Server listening on port:', SERVER_PORT);
});
