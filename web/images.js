/*
	Image routing
*/

const fs = require('fs'), path = require('path'), crypto = require('crypto');
const Config = require('../config.json');

function Images(_server, _webserver) {
	_webserver.get("/images/view/:imageid", function(req, res) {
		function queryCallback(result) {
			if (result == "not found") {
				res.redirect("/");
			} else {
				_server.generateOptions(Config["name"] + " - " + result["tags"], req, function(options) {
					options.tags = result.tags;
					options.source = "/imgs/" + result._id;
					options.artists = result.artists;
					options.uploader = result.uploader;
					options.uploaded = result.uploadDate;
					options.src = result.source;
					options.rating = result.rating;

					res.render("view", options);
				});
			}
		}

		if (req.params.imageid.length == 24) { // If the user is looking for an image via its id
			_server.indigo.database.imgs.getImage(req.params.imageid, queryCallback);
		} else {
			if(!isNaN(parseInt(req.params.imageid))) { // Via its index
				_server.indigo.database.imgs.getImageAtIndex(parseInt(req.params.imageid) - 1, queryCallback);
			} else {
				res.redirect("/");
			}
		}
	});

	_webserver.get("/images/", function(req, res) {
		_server.indigo.database.imgs.imageSearch("", null, null, function(err, imgs, pages) {
			_server.generateOptions("Gallery - " + Config["name"], req, function(options) {
				options.images = imgs;
				options.pages = pages;
				options.cpage = 1;
				res.render("gallery", options);
			});
		});
	});

	_webserver.get("/images/search", function(req, res) {
		_server.indigo.database.imgs.imageSearch(req.query.tags, null, req.query.page || null, function(err, imgs, pages) {
			if(req.query.tags.length == 0) {
				res.redirect("/images/");
			} else {
				if(imgs.length > 0) {
					_server.generateOptions("Search Results - " + Config["name"], req, function(options) {
						options.tags = req.query.s;
						options.images = imgs;
						options.pages = pages;
						options.cpage = req.query.page || 1;

						res.render("gallery", options);
					});
				} else {
					res.redirect("/images/");
				}
			}
		});
	});

	_webserver.get("/images/page/:index", function(req, res) {
		if(isNaN(parseInt(req.params.index))) {
			res.redirect("/images/");
		} else {
			if(req.params.index > 1) {
				_server.indigo.database.imgs.imageSearch("", null, req.params.index, function(err, imgs, pages) {
					if(imgs.length > 0) {
						_server.generateOptions("Gallery - " - Config["name"], req, function(options) {
							options.images = imgs;
							options.pages = pages;
							options.cpage = req.params.index || 1;

							res.render("gallery", options);
						});
					} else {
						res.redirect("/images/");
					}
				});
			} else {
				res.redirect("/images/");
			}
		}
	});

	_webserver.get("/upload", function(req, res) {
		if(Config["allow-anonymous"] || _server.isUserLoggedIn(req)) {
			_server.generateOptions("Upload - " + Config["name"], req, function(options) {
				res.render("upload", options);
			});
		} else {
			res.redirect("/");
		}
	});


	//todo: check for allow-anonymous here too
	_webserver.post("/upload", function(req, res) {
		if(req.files.length == 0) // Is a file uploaded ?
			res.redirect("/upload");

		if(req.body.tags == "") // Tags should never be empty
			res.redirect("/upload"); // Temporary solution, I'm lazy lol

		if (Config["allow-anonymous"] || _server.isUserLoggedIn(req)) {
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
								res.redirect("/images/view/" + data);
							} else {
								res.redirect("/upload"); // Again, just reload the page if there's an error, not yet implemented
							}
						});
					});
				});
			}
		} else {
			res.redirect("/");
		}
	});

	_webserver.get("/imgs/:id", function(req, res) {
		if(req.params.id) {
			_server.indigo.database.imgs.getImage(req.params.id, function(data) {
				if(data == "not found")
					res.redirect("/");
				else
					res.sendFile("./" + Config["folder"] + "/" + data.path, { root : "./"});
			});
		} else {
			res.status(404).send();
		}
	});
}

module.exports = Images;
