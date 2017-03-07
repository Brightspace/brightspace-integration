'use strict';

var fs = require('fs');
var glob = require('glob');
var minify = require('html-minifier').minify;
var path = require('path');

var dir = process.argv[2];

if (typeof dir !== 'string') {
	console.error('usage: node build-util/minify-html.js <dir>');
	process.exitCode = 1;
	return;
}

glob(path.resolve(dir, '**/*.html'), function(err, files) {
	if (err) {
		throw err;
	}

	files.forEach(function(file) {
		var filename = path.basename(file, '.html');

		fs.readFile(file, { encoding: 'utf8' }, function(err, data) {
			if (err) {
				throw err;
			}

			fs.writeFile(path.resolve(dir, filename + '.min.html'), minify(data, {
				collapseWhitespace: true,
				ignoreCustomComments: [/^\\s@license/],
				minifyCSS: true,
				minifyJS: true,
				removeComments: true
			}), function(err) {
				if (err) {
					throw err;
				}
			});
		});
	});
});
