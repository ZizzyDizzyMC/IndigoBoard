// Import the sub webserver parts
const Users = require("./users.js"), Router = require('./router.js'), Config = require('../config.json'), apiRouter = require('./apiRouter.js')
const express = require('express'), cookieParser = require('cookie-parser'), session = require('express-session'), bodyParser = require('body-parser');


// Everything web happens in this object.
function Server(_parent) {
	this.indigo = _parent; // Setup the parent item

	this.webapp = express(); // Create a basic webserver
	this.webapp.set('view engine', 'ejs'); // Rendering engine, in this case EJS
	this.webapp.use(express.static('web/files/')); // public files folder routing
	this.webapp.use(bodyParser.json()); // Body parsing for JSON/Ajax request
	this.webapp.use(bodyParser.urlencoded({ // Body parsing for old url/non javascript users
		extended:true
	}));
	this.webapp.use(cookieParser('}f6A8^T8sa;UuL!!,JY>`Q$+:8ho2B')); // Woohoo cookies

	// Options for the session parser
	var sessionOptions = {
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

	// Generate the options for EJS
	this.generateOptions = function(_title, _req, callback) {
		const options = {
			name: Config.name,
			title: _title
		};

		if(_req.signedCookies.userID || _req.session.userID) {
			options["loggedIn"] = true;
			options["username"] = _req.signedCookies.username ? _req.signedCookies.username : _req.session.username;
			callback(options);
		} else  {
			options["loggedIn"] = false;
			options["username"] = null;
			callback(options);
		}
	}

	// Web routing
	new Router(this, this.webapp);
	new Users(this, this.webapp);
	if (Config["api-enabled"]){
		new apiRouter(this, this.webapp);
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