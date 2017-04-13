/*
	RESTful API routing.
	Just dummy functions for now.
*/

function apiRouter(_server, _webserver) {
	_webserver.get('/api/docs', function(req, res) {
		res.send("dummy api docs");
	});
	
	_webserver.get('/api/v1/images', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ ping: "pong" }));
	})
	
	_webserver.get('/api/v1/search', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ ping: "pong" }));
	})		
	
	_webserver.post('/api/v1/upvote', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ ping: "pong" }));
	})
	
	_webserver.post('/api/v1/downvote', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ ping: "pong" }));
	})
	
	_webserver.post('/api/v1/unvote', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ ping: "pong" }));
	})
	
	_webserver.post('/api/v1/upload', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ ping: "pong" }));
	})
}

module.exports = apiRouter;
