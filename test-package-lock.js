'use strict';

/* eslint-disable no-console */
const chalk = require('chalk'),
	fs = require('fs'),
	path = require('path');

const packageLockPath = path.join(__dirname, 'package-lock.json');
const ignorePackages = [
	'isarray' // d2l-capture-central -> page.js -> path-to-regexp -> isarray v0.0.1 (https://github.com/visionmedia/page.js/issues/462)
];

function validate(json, depth, parentKey) {

	let numErrors = 0;

	depth++;
	for (const key in json) {
		const isDev = json[key].dev !== undefined;
		if (!isDev) {
			if (depth > 1) {
				const isIgnored = ignorePackages.indexOf(key) > -1;
				if (isIgnored) {
					console.log(chalk.yellow(`Warning: ignoring "${key}" in "${parentKey}"`));
				} else {
					numErrors++;
					console.log(`"${key}" in "${parentKey}"`);
				}
			}
			const subDeps = json[key].dependencies;
			if (subDeps !== undefined) {
				numErrors += validate(subDeps, depth, key);
			}
		}
	}

	return numErrors;

}

fs.readFile(packageLockPath, { encoding: 'utf8' }, function(err, jsonString) {

	if (err) {
		console.error('Failed to open package-lock.json', err);
		process.exitCode = 1;
		return;
	}

	console.log(chalk.blue('Checking front-end dependencies for duplicates...'));
	console.group();

	const json = JSON.parse(jsonString);
	const numErrors = validate(json.dependencies, 0, '');

	console.groupEnd();
	if (numErrors === 0) {
		console.log(chalk.green('Success!'));
	} else {
		console.log(chalk.red(`Validation failed -- ${numErrors} duplicates found.`));
		console.log('\nAll front-end dependencies must be at root level of "package-lock.json" to avoid duplicate registrations. Check that the version ranges in "package.json" do not contain anything beyond the major version.');
		process.exitCode = 1;
	}

});
