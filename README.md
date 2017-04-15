# Indigoboard
A taggable "booru-style" imageboard written in Node.js

Currently in development, and not ready for release.

# Requirements
1. NodeJS
2. NPM
3. MongoDB

# Installation

1. `git clone https://github.com/oedipuscomplex/Indigoboard.git`
2. `npm install`
3. Create a folder called 'mongo' in 'web/database/'.
4. `cd web/database/ && ./mongo.sh` to start the mongo server.
5. Connect to the database.
6. `use board`
7. Disconnect from the database.

# Configuration
The file `config.json` has a few configuration options.

* `"name"`: The imageboard name.
* `"api-enabled"`: Whether or not there should be API access.
* `"port"`: The port Indigoboard should run off of.
* `"debug"`: Whether this is a debugging or production instance.
* `"allow-anonymous"`: Allow anonymous uploads. This means that an user does not have to be registered to upload.
* `"folder"`: The folder name when returning images.
* `"version"`: Board version, should not need to be touched.

# Contact
Zoey: @TheJumono on twitter
Mike: @MikeColeDotCo on twitter
Flora: @OedipusCompiex on twitter

# License 
All code is licensed under the [GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html) unless stated otherwise.
