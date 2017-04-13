/*
	Take care of routing everything else 
 */

const Config = require('../config.json')

function Router(_server, _webserver) {
	_webserver.get('/', function(req, res) {
		_server.generateOptions("Index - " + Config["name"], req, function(options) {
			res.render('index', options);
		});
	});

	_webserver.get('/search/', function(req, res) {
		_server.generateOptions("Search -" + Config["name"], req, function(options) {
			res.render('search', options);
		});
	});

	_webserver.get('/about/', function(req, res) {
		res.send("xd")
	});
}

module.exports = Router;
