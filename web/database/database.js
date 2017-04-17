/*
	Take care of any database access
*/

const MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server,ObjectId = require('mongodb').ObjectId;
const dbUsers = require('./db_users.js'), dbImages = require('./db_images.js');

function Database(_parent) {

	// The local url of the database
	this.DatabaseUrl = "mongodb://localhost:27017/board";

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
	this.imgs = new dbImages(this);
}

module.exports = Database;