/*
	Database code that take care of everything image related.
*/

const fs = require('fs'), bcrypt = require('bcrypt-nodejs');

function databaseImages(_database) {

	const cName = "images"; // Name of the collection
	const self = this; // Setting a pointer variable to the 'this' object

	this.getImage = function(_imageID, callback){
		_database.connect(function(db) {
			db.collection(cName).find({_id:_database.ObjectId(_imageID)}).toArray(function(err, result) {
				if(result.length > 0)
					callback(result[0]);
				else
					callback("not found");
			});
		});
	}

	this.getImageAtIndex = function(_index, callback) {
		_database.connect(function(db) {
			console.log(_index);
			db.collection(cName).find().skip(_index).limit(1).toArray(function(err, result) {
				if(result.length > 0) 
					callback(result[0]);
				else
					callback("not found");
			});
		});
	}

	this.addImage = function(_hash, _path, _tags, _uploader, _artists, _source, _rating, callback) {
		_database.connect(function(db) {
			const creationDate = new Date();

			db.collection(cName).insert({
				hash: _hash,
				path: _path,
				tags: _tags,
				artists: _artists || "unknown",
				source: _source || "unknown",
				rating: _rating || "safe",
				uploader: _uploader,
				uploadDate: creationDate
			}, function(err, result) {
				if(err)
					callback("error", null);
				else
					callback(null, result.ops[0]._id);
			});
		});
	}
}

module.exports = databaseImages;
