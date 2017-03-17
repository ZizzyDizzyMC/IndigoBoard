// Import some stuff
const Database = require('./web/database/database.js'), Server = require('./web/server.js');

function Indigoboard() {
	this.database = new Database(this); // Load the database and shit
	this.webserver = new Server(this); // Load the web server tbh
}

// Literally creating the whole thing.
new Indigoboard();