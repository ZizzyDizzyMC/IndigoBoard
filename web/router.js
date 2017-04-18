/*
	Take care of routing everything else
 */

const Config = require('../config.json'), Rules = require('../rules.json')

function Router(_server, _webserver) {
	_webserver.get('/', function(req, res) {
		_server.generateOptions(Config["name"], req, function(options) {
			res.render('index', options);
		});
	});

	_webserver.get('/search/', function(req, res) {
		_server.generateOptions("Search - " + Config["name"], req, function(options) {
			res.render('search', options);
		});
	});

	_webserver.get('/about/', function(req, res) {
		res.send("xd")
	});

	_webserver.get('/rules/', function(req, res){
		_server.generateOptions("Rules - " + Config["name"], req, function(options){
			options.rules = Rules
			res.render('rules', options)
		});
	});
}

module.exports = Router;
