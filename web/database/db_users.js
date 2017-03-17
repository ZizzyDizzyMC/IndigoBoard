/*
	Database access for the users
*/

const bcrypt = require('bcrypt-nodejs');

function DatabaseUsers(_database) {

	const cName = "users"; // Name of the collection
	const self = this; // Setting a pointer variable to the 'this' object 

	// Check if user exists / Get user's id 
	this.getUserId = function(_string, callback) {
		_database.connect(function(db) {
			db.collection(cName).find({$or:[ {email:_string},{username:_string} ]}).toArray(function(err, result) {
				if(result.length > 0) 
					callback(result[0]["_id"]);
				else 
					callback("not found");
			});
		});
	}

	// If user exists
	this.userExists = function(_userID, callback) {
		_database.connect(function(db) {
			db.collection(cName).find({_id:_database.ObjectId(_userID)}).toArray(function(err, result) {
				if(result.length > 0)
					callback(true);
				else
					callback(false);
			});
		});
	}

	// Check if an username is already used
	this.isUsernameAvaible = function(_username, callback) {
		this.getUserId(_username, function(result) {
			if(result == "not found") 
				callback(true);
			else
				callback(false);
		});
	}

	// same as above but for emails
	this.isEmailAvaible = function(_email, callback) {
		this.getUserId(_email, function(result) {
			if(result == "not found") 
				callback(true);
			else
				callback(false);
		});
	}

	// Check if an username is valid
	this.verifyUsername = function(_username, callback) {
		const usernameRegex = new RegExp('[^A-Z0-9]', 'i');
		callback(!usernameRegex.test(_username))
	}

	// Check if an email is valid
	this.verifyEmail = function(_email, callback) {
		const emailRegex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		callback(emailRegex.test(_email));
	}

	// Compare the user inputed password with the one on the server.
	this.comparePassword = function(_password, _hashed, callback) {
		bcrypt.compare(_password, _hashed, function(err, res) {
			callback(res);
		});
	}

	// Hash the user's password
	this.hashPassword = function(_password, callback) {
		bcrypt.hash(_password, null, null, function(err, hash) {
			callback(hash);
		});
	}

	// Add an user to the databse
	this.createUser = function(_username, _password, _email, callback) {
		this.isUsernameAvaible(_username, function(result) {
			if(result) {
				self.verifyUsername(_username, function(result) {
					if(result) {
						self.isEmailAvaible(_email, function(result) {
							if(result) {
								self.verifyEmail(_email, function(result) {
									if(result) {
										self.hashPassword(_password, function(hash) {
											_database.connect(function(db) {
												const creationDate = new Date();

												db.collection("users").insert({
													username: _username,
													password: hash,
													email: _email,
													created: creationDate
												}, function(err, result) {
													if(err)
														callback("error");
													else
														callback("success");
												});
											});
										});
									} else {
										callback("invalid email");
									}
								});
							} else {
								callback("email used");
							}
						});
					} else {
						callback("invalid username");
					}
				});
			} else {
				callback("username used");
			}
		});
	}

	// Log an user in
	this.logUser = function(_username, _password, callback) {
		this.getUserId(_username, function(userid) {
			if(userid == "not found") {
				callback("not found", null, null);
			} else {
				_database.connect(function(db) {
					db.collection(cName).find({_id:_database.ObjectId(userid)}).toArray(function(err, user) {
						if(err) {
							callback("error", null, null);
						} else {
							self.comparePassword(_password, user[0].password, function(result) {
								if(result) {
									callback(null, userid, user[0].username);
								} else {
									callback("incorrect", null, null);
								}
							});
						}
					})
				});
			}
		});
	}

	// Get user information via hash/session/cookie
	this.getUserInfo = function(_userID, _info, callback) {
		_database.connect(function(db) {
			db.collection(cName).find({_id:_database.ObjectId(_userID)}).toArray(function(err, result) {
				callback(result[0][_info]);
			});
		});
	}

	// Update specific user data
	this.updateUser = function(_userID, _toUpdate, _data, callback) {

	}

	// Set user's info or update multiple information at once
	this.setUserInfo = function(_username, _password, _email, _sbio, _bio, _role, callback) {

	}
}

module.exports = DatabaseUsers;