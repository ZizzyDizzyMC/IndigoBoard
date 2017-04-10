/*
	Anything user related is done here
*/

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
				// uuh I forgot what's supposed to happen here lol
			} else {
				errorHandler("User not found", "/users/", res);
			}
		});
	});

	_webserver.get("/user/login", function(req, res) {
		_server.generateOptions("Login", req, function(options) {
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
		_server.generateOptions("Register", req, function(options) {
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
				errorHandler("Username too short.");
			} else if(req.body.username.length > 20) {
				errorHandler("Username too long.");
			} else if(req.body.password.length < 4) {
				errorHandler("Password too short");
			} else if(req.body.password.length > 64) {
				errorHandler("Password too long.");
			} else {
				_server.indigo.database.users.createUser(req.body.username, req.body.password, req.body.email, function(result) {
					switch (result) {
						case "username used":
							errorHandler("Username already in use.", req.get("Referrer"));
							break;

						case "invalid username":
							errorHandler("Invalid username", req.get("Referrer"));
							break;

						case "email used":
							errorHandler("Email already in use.", req.get("Referrer"));
							break;

						case "invalid email":
							errorHandler("Invalid email.", req.get("Referrer"));
							break;

						case "error":
							errorHandler("The fuck happened.", req.get("Referrer"));
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

	// Log an user out
	_webserver.get("/user/logout", function(req, res) {
		if(req.session.username) {
			req.session.destroy(function(err) {
				if(err) {
					errorHandler("Couldn't log the user out ???", req.get("Referrer"), res);
				} else {
					errorHandler("The user was logged out correctly.", req.get("Referrer"), res);
				}
			});
		} else if(req.signedCookies.username) {
			try {
				res.clearCookie("user");
				errorHandler("The user was logged out correctly.", req.get("Referrer"), res);
			} catch(err) {
				errorHandler("Couldn't log the user out ???", req.get("Referrer"), res);
			}
		} else {
			errorHandler("No user is logged in.", req.get("Referrer"), res);
		}
	});
}

module.exports = Users;