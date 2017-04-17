/*
	RESTful API routing.
	Just dummy functions for now.
*/

const Config = require('../config.json')

function apiRouter(_server, _webserver) {
	_webserver.get('/api/docs', function(req, res) {
		res.send("dummy api docs");
	});

	_webserver.get('/api/v1/images/:imageid', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		function queryCallback(result) {
			if (result == "not found") {
				res.send(JSON.stringify({}));
			} else {
				res.send(JSON.stringify({
					id : result._id,
					tags : result.tags,
					source : result.source,
					artists : result.artists,
					uploader : result.uploader,
					uploaded : result.uploadDate,
					md5 : result.hash,
					url : "/imgs/" + result._id,
					rating : result.rating
				}))
			}
		}

		if (req.params.imageid.length == 24) { // If the user is looking for an image via its id
			_server.indigo.database.imgs.getImage(req.params.imageid, queryCallback);
		} else {
			if(!isNaN(parseInt(req.params.imageid))) { // Via its index
				_server.indigo.database.imgs.getImageAtIndex(parseInt(req.params.imageid) - 1, queryCallback);
			} else {
				res.send(JSON.stringify({}));
			}
		}
	});

	_webserver.get('/api/v1/search', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		if (!(req.query.tags)){
			res.send(JSON.stringify({"error" : "You need tags!"}));
		}
		else{
		_server.indigo.database.imgs.imageSearch(req.query.tags, req.query.limit || null, req.query.page || null, function(err, imgs, pages) {
			if (err) {
				res.send(JSON.stringify({"error" : "Something went wrong!"}));
			}
			else {
				a = []
				for (var i = 0; i < result.length; i++) {
					r = result[i]
					o = {
						id : r._id,
						tags : r.tags,
						source : r.source,
						artists : r.artists,
						uploader : r.uploader,
						uploaded : r.uploadDate,
						md5 : r.hash,
						url : "/imgs/" + r._id,
						rating : r.rating
					}
					a.push(r)
				}
				res.send(JSON.stringify({results : a}));
			}
		})};
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
