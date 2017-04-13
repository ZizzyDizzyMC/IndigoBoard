/*
	Database code that take care of everything image related.
*/

const fs = require('fs'), bcrypt = require('bcrypt-nodejs'), crypto = require('crypto');

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

	this.addImage = function(_path, _tags, _uploader, _artists, _source, _rating, callback) {

		if(fs.existsSync(_path)) {

			// Calculate the hash at first
			fs.readFile(_path, function(err, data) {
				const hash = crypto.createHash("md5").update(data, 'utf-8').digest('hex');
				console.log(hash);

				_database.connect(function(db) {
					const creationDate = new Date();

					db.collection(cName).insert({
						hash: hash,
						image: _path,
						tags: _tags,
						artists: _artists || "unknown",
						source: _source || "unknown",
						rating: _rating || "safe",
						uploader: _uploader,
						uploadDate: creationDate
					}, function(err, result) {
						if(err)
							callback("error");
						else
							callback("success");
					});
				});
			});

		} else {
			console.error("File not found!");
		}
	}
}

module.exports = databaseImages;
