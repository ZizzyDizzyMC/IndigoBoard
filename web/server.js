// Import the sub webserver parts
const Users = require("./users.js"), Router = require('./router.js'), Config = require('../config.json'), api = require('./api.js'), Images = require('./images.js')
const express = require('express'), cookieParser = require('cookie-parser'), session = require('express-session'), bodyParser = require('body-parser'), fs = require('fs'), fileUpload = require('express-fileupload');

// Everything web happens in this object.
function Server(_parent) {
	this.indigo = _parent; // Setup the parent item

	this.webapp = express(); // Create a basic webserver
	this.webapp.set('view engine', 'ejs'); // Rendering engine, in this case EJS

	this.webapp.use(express.static('web/files/')); // public files folder routing
	if(!fs.existsSync(Config["folder"])) // Make sure the main directory for images is available to use
		fs.mkdirSync(Config["folder"]);
	if(!fs.existsSync(Config["folder"] + "/tmp")) // Make sure the temp folder exists
		fs.mkdirSync(Config["folder"] + "/tmp");
	fs.readdirSync(Config["folder"] + "/tmp").forEach(function(f) { 
		fs.unlink(Config["folder"] + "/tmp/" + f); // Clean the tmp folder at launch
	});

	this.webapp.use(bodyParser.json()); // Body parsing for JSON/Ajax request
	this.webapp.use(bodyParser.urlencoded({ // Body parsing for old url/non javascript users
		extended:true
	}));
	this.webapp.use(cookieParser('}f6A8^T8sa;UuL!!,JY>`Q$+:8ho2B')); // Woohoo cookies
	this.webapp.use(fileUpload()); // For file uploading

	// Options for the session parser
	const sessionOptions = {
		secret: '}f6A8^T8sa;UuL!!,JY>`Q$+:8ho2B',
		cookie: {}
	}

	// Enable secure session when not in testing mode
	if(!Config.debug) {
		this.webapp.set('trust proxy', 1);
		sessionOptions.cookie.secure = true;
	}

	// For sessions
	this.webapp.use(session(sessionOptions));

	// Get logged in user
	this.loggedUser = function(_req) {
		if(_req.signedCookies.userID || _req.session.userID)
			return _req.signedCookies.username ? _req.signedCookies.username : _req.session.username;
		else 
			return null;
	}

	// Generate the options for EJS
	this.generateOptions = function(_title, _req, callback) {
		const options = {
			name: Config.name,
			title: _title,
			anonup: Config["allow-anonymous"]
		};

		if(_req.signedCookies.userID || _req.session.userID) {
			options["loggedIn"] = true;
			options["username"] = this.loggedUser(_req);
			callback(options);
		} else  {
			options["loggedIn"] = false;
			options["username"] = this.loggedUser(_req);
			callback(options);
		}
	}

	// Web routing
	new Router(this, this.webapp);
	new Users(this, this.webapp);
	new Images(this, this.webapp);
	if (Config["api-enabled"]){
		new api(this, this.webapp);
	}

	// Take care of non existing pages
	this.webapp.get('*', function(req, res) {
		res.redirect("/");
	});

	// Launch the web server
	this.webapp.listen(Config.port, function() {
		console.log("Server listening on the port: " + Config.port);
	});


}

module.exports = Server;
