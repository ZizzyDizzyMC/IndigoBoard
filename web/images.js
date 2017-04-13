/*
	Image routing
*/

const Config = require('../config.json')

function Images(_server, _webserver) {

	function errorHandler(_error, _url, _res) {
		_res.render("error", {title:"Error", error:_error, return_url:_url});
	}

	_webserver.get("/view/:imageid", function(req, res) {
		// so it doesn't error when finding the id in the database
		if (req.params.imageid.length < 24) {
			errorHandler("The specified image wasn't found.", req.get("Referrer"), res)
		} else {
			_server.indigo.database.imgs.getImage(req.params.imageid, function(result) {
				if (result == "not found"){
					errorHandler("The specified image wasn't found.", req.get("Referrer"), res);
				} else {
					_server.generateOptions(Config["name"] + " - " + result["tags"], req, function(options) {
						options.tags = result.tags
						options.source = result.image
						res.render("view", options)
					});
				}
			});
		}
});
}

module.exports = Images;
