/*
	Anything user related is done here
*/

const Config = require('../config.json')

function Users(_server, _webserver) {

	function errorHandler(_error, _url, _res) {
		_res.render("error", {title:"Error", error:_error, return_url:_url});
	}

	_webserver.get("/users/", function(req, res) {
		res.send("return users list here");
	});

	_webserver.get("/users/:username", function(req, res) {
		_server.indigo.database.users.isUsernameAvaible(req.params.username, function(result) {
			if(!result) {
				_server.generateOptions("User profile of " + req.params.username, req, function(options) {
					_server.indigo.database.users.getUserId(req.params.username, function(uID) {
						_server.indigo.database.users.getUserInfos(uID, function(infos) {
							options["creationDate"] = infos.created;
							options["profilename"] = infos.username;
							options["creationEmail"] = infos.email;

							res.render("user", options);
						});
					});
				});
			} else {
				res.redirect("index");
			}
		});
	});

	_webserver.get("/user/login", function(req, res) {
		_server.generateOptions("Login - " + Config["name"], req, function(options) {
			if(options.loggedIn) {
				res.redirect("index");
			} else {
				res.render("login", options);
			}
		});
	});

	// User login without javacript
	_webserver.post("/user/login", function(req, res) {
		// First we check if there's the required data
		if(req.body.username && req.body.password) {
			// Check if the user already logged in (Either via session or cookie)
			if(req.session.userID || req.signedCookies.userID) {
				errorHandler("Already logged in", req.get("Referrer"), res);
			} else {
				_server.indigo.database.users.logUser(req.body.username, req.body.password, function(err, userID, username) {
					if(err == "not found") {
						errorHandler("Username not found.", req.get("Referrer"), res);
					} else if(err == "error") {
						errorHandler("Something happened.", req.get("Referrer"), res);
					} else if(err == "incorrect") {
						errorHandler("The username or the password is incorrect", req.get("Referrer"), res);
					} else {
						if(req.body.keeplogin) {
							res.cookie("userID", userID, {
								signed: true
							});

							res.cookie("username", username, {
								signed: true
							});
						} else {
							req.session.userID = userID;
							req.session.username = username;
						}

						res.redirect(req.get("Referrer"));
					}
				});
			}
		} else {
			errorHandler("No username or password was specified.", req.get("Referrer"), res);
		}
	});

	// Return the registration page
	_webserver.get("/user/register", function(req, res) {
		_server.generateOptions("Register - " + Config["name"], req, function(options) {
			if(options.loggedIn) {
				res.redirect("index");
			} else {
				res.render("register", options);
			}
		});
	});

	// User registration without javascript
	_webserver.post("/user/register", function(req, res) {
		// Check if the required data is there
		if(req.body.username && req.body.password && req.body.email) {
			if(req.body.username.length < 4) {
				errorHandler("Username too short.", req.get("Referrer"), res);
			} else if(req.body.username.length > 20) {
				errorHandler("Username too long.", req.get("Referrer"), res);
			} else if(req.body.password.length < 4) {
				errorHandler("Password too short", req.get("Referrer"), res);
			} else if(req.body.password.length > 64) {
				errorHandler("Password too long.", req.get("Referrer"), res);
			} else {
				_server.indigo.database.users.createUser(req.body.username, req.body.password, req.body.email, function(result) {
					switch (result) {
						case "username used":
							errorHandler("Username already in use.", req.get("Referrer"), res);
							break;

						case "invalid username":
							errorHandler("Invalid username", req.get("Referrer"), res);
							break;

						case "email used":
							errorHandler("Email already in use.", req.get("Referrer"), res);
							break;

						case "invalid email":
							errorHandler("Invalid email.", req.get("Referrer"), res);
							break;

						case "error":
							errorHandler("The fuck happened.", req.get("Referrer"), res);
							break;

						default:
							res.redirect("/user/login");
							break;

					}
				});
			}
		} else {
			errorHandler("No username or password was specified.", req.get("Referrer"));
		}
	});

	// Log the user out
	_webserver.get("/user/logout", function(req, res) {
		if (req.session.username || req.signedCookies.username) {
			if (req.session.username) {
				req.session.destroy(function(err) {
					if(err){
						errorHandler("Couldn't log the user out ???", req.get("Referrer"), res);
					} else {
						errorHandler("The user was logged out correctly.", req.get("Referrer"), res);
					}
				});
			}
			
			if (req.signedCookies.username) {
				try {
					res.clearCookie("userID");
					res.clearCookie("username");
					errorHandler("The user was logged out correctly.", req.get("Referrer"), res);
				} catch(err) {
					errorHandler("Couldn't log the user out ???", req.get("Referrer"), res);
				}
			}
		} else {
			errorHandler("No user is logged in.", req.get("Referrer"), res);
		}
	});





}

module.exports = Users;
