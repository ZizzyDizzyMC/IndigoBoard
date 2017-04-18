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
				db.close();
			});
		});
	}

	this.imageSearch = function(_search, _limit, _page, callback) {
		_database.connect(function(db) {
			const searchTags = _search.length == 0 ? [] : _search.split(','); // Make sure the search isn't empty

			// Make sure the optional parameters are correct.
			_limit = !isNaN(parseInt(_limit))
				? (parseInt(_limit) <= 50 ? parseInt(_limit) : 50)
				: 50;

			_page = !isNaN(parseInt(_page))
				? parseInt(_page)
				: 1;

			// Initial search query, will implement $or someday I swear
			var query = {};

			if(searchTags.length > 0) {
				query["$and"] = [];
			}

			// The temporary query
			var superQuery = {};

			// Indentifier for searches
			const searchableTags = ["artists", "rating", "uploader", "tags"];

			// Populate the superQuery object.
			for(var _sTag in searchableTags) {
				superQuery[searchableTags[_sTag]] = {
					included: [],
					notIncluded: []
				};
			}

			// Array later used for searching
			var artistArray = [],
				ratingArray = [],
				includedArray = [],
				notIncludedArray = [];

			// Let's go through the list
			for(var tag in searchTags) {
				var _tag = searchTags[tag].trim();

				const _excluded = _tag.startsWith("-") ? true : false; // Should the tag be excluded ?
				_tag = _excluded ? _tag.substring(1) : _tag; // Remove the "-" from the string

				// Add an item to the superQuery object
				function queryAdd(_name, _item) {
					superQuery[_name][_excluded ? "notIncluded" : "included"].push(_item);
				}

				// I wanted to use a switch case but it wasn't working, using if, else instead.
				if(_tag.startsWith("artist:")) {
					queryAdd("artists", _tag.replace("artist:", ""));
				} else if(_tag.startsWith("rating:")) {
					queryAdd("rating", _tag.replace("rating:", ""));
				} else if(_tag.startsWith("uploader:")) {
					queryAdd("uploader", _tag.replace("uploader:", ""));
				} else {
					queryAdd("tags", _tag);
				}
			}

			// Sorting algorithm
			for(p in superQuery) {
				function addToQuery(_what, _is, _item) {
					query["$and"].push({
						[_what]: {[_is]: [_item]}
					});
				}

				// For excluded items
				for(var _nin in superQuery[p].notIncluded) {
					addToQuery(p, '$nin', superQuery[p].notIncluded[_nin]);
				}

				// For included items
				for(var _in in superQuery[p].included) {
					addToQuery(p, '$in', superQuery[p].included[_in]);
				}
			}

			db.collection(cName).find(query).skip((_page - 1) * 5 ).limit(_limit).toArray(function(err, result) {
				if(!err) {
					db.collection(cName).find(query).count(function(err, count) {
						const pages = Math.ceil(count / 5); // Number of pages

						callback(null, result, pages);
					});
				} else
					callback("error");

				db.close();
			});
		});
	}

	this.getImageAtIndex = function(_index, callback) {
		_database.connect(function(db) {
			db.collection(cName).find().skip(_index).limit(1).toArray(function(err, result) {
				if(result.length > 0)
					callback(result[0]);
				else
					callback("not found");
				db.close();
			});
		});
	}

	this.addImage = function(_hash, _path, _tags, _uploader, _artists, _source, _rating, callback) {
		_database.connect(function(db) {
			const creationDate = new Date(); // When the upload happened

			// Turn the tags and artist parameter into arrays.
			var tagsArray = _tags.split(','),
				artistsArray = _artists.split(',');

			for(var tag in tagsArray) {
				tagsArray[tag] = tagsArray[tag].trim();
			}

			for(var artist in artistsArray) {
				artistsArray[artist] = artistsArray[artist].trim();
			}

			// Convert the selected rating into an array as well.
			if(_rating) {
				switch(_rating.toLowerCase()) {
					case "safe":
						_rating = ["safe", "s"];
						break;

					case "explicit":
						_rating = ["explcit", "e"];
						break;

					case "questionable":
						_rating = ["questionable", "q"];
						break;
				}
			}

			// "Upload" the picture into the database.
			db.collection(cName).insert({
				hash: _hash,
				path: _path,
				tags: tagsArray,
				artists: _artists || ["unknown"],
				source: _source || "unknown",
				rating: _rating || ["safe", "s"],
				uploader: [_uploader],
				uploadDate: creationDate
			}, function(err, result) {
				if(err)
					callback("error", null);
				else
					callback(null, result.ops[0]._id);

				db.close();
			});
		});
	}
}

module.exports = databaseImages;
