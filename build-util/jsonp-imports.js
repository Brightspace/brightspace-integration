'use strict';

var fs = require('fs');
var glob = require('glob');
var path = require('path');

glob(process.argv[2], function (err, files) {
	if (err) {
		throw err;
	}

	files.forEach(function (file) {
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				throw err;
			}

			var resourceId = path.basename(file);
			var js = '_d2l_receiveJsonpImport(' + JSON.stringify(resourceId) + ',' + JSON.stringify(data) + ');';

			fs.writeFile(file + '.js', js, 'utf8', function (err) {
				if (err) {
					throw err;
				}
			});
		});
	});
});
