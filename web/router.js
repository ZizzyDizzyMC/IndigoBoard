/*
	Take care of routing everything else 
 */

function Router(_server, _webserver) {
	_webserver.get('/', function(req, res) {
		_server.generateOptions("index", req, function(options) {
			res.render('index', options);
		})
	});

	_webserver.get('/about/', function(req, res) {
		res.send("xd")
	});
}

module.exports = Router;