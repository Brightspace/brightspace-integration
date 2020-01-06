'use strict';

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const packageLockPath = path.join(__dirname, 'package-lock.json');
const packages = [
	'd2l-fetch',
	'd2l-fetch-auth',
	'd2l-fetch-dedupe',
	'd2l-fetch-simple-cache',
	'd2l-hypermedia-constants',
	'd2l-organization-hm-behavior',
	'd2l-polymer-siren-behaviors',
	'd2l-telemetry-browser-client',
	'@brightspace-ui/core',
	'@brightspace-ui/intl'
];

function validate(json, depth, parentKey) {
	depth++;
	for (const key in json) {
		if (depth > 1) {
			const isPolymer = json[key].requires !== undefined && json[key].requires['@polymer/polymer'] !== undefined;
			if (isPolymer || packages.indexOf(key) > -1) {
				console.error(`Polymer sub-dependency detected "${key}" in "${parentKey}". All Polymer dependencies must be at root level of "package-lock.json" to avoid duplicate registrations. Check that the version ranges in "package.json" do not contain anything beyond the major version.`);
				process.exitCode = 1;
			}
		}
		const subDeps = json[key].dependencies;
		if (subDeps !== undefined) {
			validate(subDeps, depth, key);
		}
	}
}

fs.readFile(packageLockPath, { encoding: 'utf8' }, function(err, jsonString) {

	if (err) {
		console.error('Failed to open package-lock.json', err);
		process.exitCode = 1;
		return;
	}

	const json = JSON.parse(jsonString);
	validate(json.dependencies, 0, '');

});
