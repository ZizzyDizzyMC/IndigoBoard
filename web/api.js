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


// i just copied the post /upload/ code lmao
	_webserver.post('/api/v1/upload', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		_server.indigo.database.users.logUser(req.body.username, req.body.password, function(err, id, username){

			if (err == "not found" || err == "incorrect") {
				res.send(JSON.stringify({error: "Login information was incorrect."}))
			} else if (err) {
				res.send(JSON.stringify({error: "Something went wrong."}))
			} else {

				if(req.files.length == 0) // Is a file uploaded ?
					res.send(JSON.stringify({error: "No files were uploaded."}))

				if(req.body.tags == "") // Tags should never be empty
					res.send(JSON.stringify({error: "No tags were sent."}))

				if (!(req.body.rating in ["safe", "s", "questionable", "q", "explicit", "e"]))
					res.send(JSON.stringify({error: "The rating specified does not exist."}))

				for(file in req.files) {

					req.files[file].mv('./' + Config["folder"] + '/tmp/' + req.files[file].name, function(err) {
						if(err)
							console.error("something went wrong oops lol");

						fs.readFile('./' + Config["folder"] + '/tmp/' + req.files[file].name, function(err, data) {
							const hash = crypto.createHash("md5").update(data, 'utf-8').digest('hex');
							const subhash = hash.substring(0,2);
							const uploader = _server.loggedUser(req) == null ? "Anonymous" : _server.loggedUser(req);
							const finalPath = subhash + "/" + hash + path.extname(req.files[file].name);

							if(!fs.existsSync("./" + Config["folder"] + "/" + subhash))
								fs.mkdirSync("./" + Config["folder"] + "/" + subhash); // Create the subfolder
							fs.renameSync("./" + Config["folder"] + "/tmp/" + req.files[file].name, "./imgs/" + finalPath); // Add the file to the correct folder

							_server.indigo.database.imgs.addImage(hash, finalPath, req.body.tags, uploader, req.body.artists, req.body.source, req.body.rating, function(err, data) {
								if(err == null) {
									res.send(JSON.stringify({success: "The image was uploaded successfully."}))
								} else {
									res.send(JSON.stringify({error: "Something went wrong."}))
								}
							});
						});
					});
				}
			}
		});
	})
}

module.exports = apiRouter;
