// Import some stuff
const Database = require('./web/database/database.js'), Server = require('./web/server.js');

function Indigoboard() {
	this.database = new Database(this); // Load the database and shit
	this.webserver = new Server(this); // Load the web server tbh

	console.log("finna test the user databse code.");
	this.database.imgs.addImage("/home/flora/Pictures/wallpaper.png", "safe,gay,celestia,pink", "ADMIN", null, null, null, function(res) {
		console.log(res);
	});
}

// Literally creating the whole thing.
new Indigoboard();
