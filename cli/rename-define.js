'use strict';

/* eslint-disable no-console */

const fs = require('fs'),
	glob = require('glob'),
	replacer = require('./define-replacer.js');

console.log('Replacing "define" with "define2"...');
for (let i = 2; i < process.argv.length; i++) {
	glob(process.argv[i], function(err, files) {
		if (err) {
			throw err;
		}
		files.forEach(function(file) {
			fs.readFile(file, 'utf8', function(err, data) {
				if (err) {
					throw err;
				}
				const js = replacer(data);
				fs.writeFile(file, js, 'utf8', function(err) {
					if (err) {
						throw err;
					}
				});
			});
		});
	});
}
