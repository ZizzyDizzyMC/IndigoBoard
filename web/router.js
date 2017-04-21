/*
	Take care of routing everything else
 */

const Config = require('../config.json')

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
		_server.generateOptions("About - " + Config["name"], req, function(options){
			res.render('about', options);
		});
	});

	_webserver.get('/contact/', function(req, res) {
		_server.generateOptions("Contact - " + Config["name"], req, function(options){
			res.render('about', options);
		});
	});

	_webserver.get('/rules/', function(req, res){
		_server.generateOptions("Rules - " + Config["name"], req, function(options){
			res.render('rules', options)
		});
	});
}

module.exports = Router;
