/*
	Take care of any database access
*/

const MongoClient = require('mongodb').MongoClient, ObjectId = require('mongodb').ObjectId;
const dbUsers = require('./db_users.js');

function Database(_parent) {

	this.DatabaseUrl = "mongodb://localhost:27017/forums"; // Will need to change this k

	// Used to connect to the db
	this.connect = function(callback) {
		MongoClient.connect(this.DatabaseUrl, function(err, db) {
			if (err) throw err;

			callback(db);
		});
	}

	// Return an ObjectId object
	this.ObjectId = function(id) {
		return new ObjectId(id);
	}

	// Setup database access point
	this.users = new dbUsers(this);
}

module.exports = Database;