/*
	RESTful API routing.
	Just dummy functions for now.
*/

function apiRouter(_server, _webserver) {
	_webserver.get('/api/docs', function(req, res) {
		res.send("dummy api docs");
	});
	
	_webserver.ger('/api/v1/images', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ ping: "pong" }));
	})
}

module.exports = apiRouter;