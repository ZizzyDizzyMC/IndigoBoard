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

	this.imageSearch = function(_tags, callback){
		_database.connect(function(db){
			tagsArray = _tags.split(',');

			var query = {}
			inArray = [];
			ninArray = [];

			for (var i = 0; i < tagsArray.length; i++){
				if (tagsArray[i].startsWith("-")){
					ninArray.push(tagsArray[i].trim().substring(1))
				} else {
				inArray.push(tagsArray[i].trim())
			}
			}
			if (inArray.length == 0){
				query.tags = {$nin : ninArray}
			} else {
				query.tags = {$in : inArray, $nin : ninArray}
			}

			db.collection(cName).find(query).toArray(function(err, result){
				if(err)
					callback("error")
				else{
					callback(result)
			};
		});
	})
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

			var tagsArray = _tags.split(',');

			for (var i = 0; i < tagsArray.length; i++){
				tagsArray[i] = tagsArray[i].trim()
			}

			db.collection(cName).insert({
				hash: _hash,
				path: _path,
				tags: tagsArray,
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
