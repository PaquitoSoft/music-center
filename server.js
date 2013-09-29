var connect = require('connect'),
	fs = require('fs');

var SERVER_PORT = 3003;

var app = connect()
	.use(connect.logger('dev'))
	.use(connect.compress())
	// .use(connect.static(__dirname, {maxAge: 365 * 24 * 3600 * 1000})) // One year static content expiration
	.use(connect.static(__dirname + '/dist', {maxAge: 365 * 24 * 3600 * 1000})) // One year static content expiration
	.use(function(req, res) {
		res.end('This is a static content server.');
		// fs.createReadStream('dist/index.html').pipe('res');
	});

app.listen(SERVER_PORT, function() {
	console.log('Server listening on port:', SERVER_PORT);
});
