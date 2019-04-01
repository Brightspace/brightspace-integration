/* eslint no-console: "off" */

'use strict';

const chalk = require('chalk'),
	Octokit = require('@octokit/rest'),
	rally = require('rally');

//  https://github.com/octokit/rest.js
//  https://octokit.github.io/rest.js/
const gh = new Octokit({
	auth: `token ${process.env.GITHUB_TOKEN}`
});

const owner = 'Brightspace';
const repo = 'brightspace-integration';
const versionChecker = /^20\.[0-9]{2}\.(1|2|3|4|5|6|7|8|9|10|11|12)$/;
const rallyVersionChecker = /^(20\.[0-9]{2}\.)([0-9]{2})$/;
const skipReleaseFlag = '[skip release]';

async function tryGetActiveDevelopmentRelease() {

	console.log('  Fetching active development release from Rally...');

	//  https://github.com/RallyTools/rally-node/wiki/User-Guide
	const rallyApi = rally({
		apiKey: process.env.RALLY_API_KEY,
		apiVersion: 'v2.0',
		requestOptions: {
			headers: {
				'X-RallyIntegrationName': 'BSI autotag',
				'X-RallyIntegrationVendor': 'D2L Corporation',
				'X-RallyIntegrationVersion': '1.0'
			}
		}
	});

	// Add 12 hours to the current time to account for branching occurring at
	// noon on the last day of the release. After branching occurs, we consider
	// it to be the following release.
	const now = new Date();
	now.setHours(now.getHours() + 12);

	// format: 2019-03-16T03:59:59.000Z
	const nowISO = now.toISOString();

	// query to find release in active development
	let releases;
	try {
		releases = await rallyApi.query({
			type: 'release',
			limit: 1,
			fetch: ['Name'],
			query: rally.util.query.where('ReleaseStartDate', '<=', nowISO).and('ReleaseDate', '>', nowISO).and('Project.Name', '=', 'D2L')
		});
	} catch (e) {
		console.error(chalk.red(e));
		process.exitCode = 1;
		return null;
	}
	if (releases.TotalResultCount !== 1) {
		console.error(chalk.red('    Error: Unable to query for active development release in Rally.'));
		process.exitCode = 1;
		return null;
	}

	let activeReleaseName = releases.Results[0].Name;
	const match = rallyVersionChecker.exec(activeReleaseName);
	if (!match) {
		console.error(chalk.red(`    Error: Invalid Rally release name "${activeReleaseName}".`));
		process.exitCode = 1;
		return null;
	}

	// strip off leading "0" from month part of the release
	let monthPart = match[2];
	if (monthPart.startsWith('0')) {
		monthPart = monthPart.substring(1);
	}
	activeReleaseName = match[1] + monthPart;

	console.log(chalk.green(`    Success! Active development release is: "${activeReleaseName}"`));

	return activeReleaseName;

}

async function tryFindMaxVersion(release) {

	const releaseRe = new RegExp('^v' + release.replace('.', '\\.') + '-([0-9]+)$');

	const options = gh.repos.listReleases.endpoint.merge({
		'owner': owner,
		'repo': repo,
		'per_page': 100
	});
	let releases;
	try {
		releases = await gh.paginate(
			options,
			response => response.data.map(release => release.tag_name)
		);
	} catch (e) {
		console.error(chalk.red(e));
		process.exitCode = 1;
		return null;
	}

	let maxVersion = 0;
	for (let i = 0; i < releases.length; i++) {
		const match = releaseRe.exec(releases[i]);
		if (match) {
			const version = parseInt(match[1]);
			if (version > maxVersion) {
				maxVersion = version;
			}
		}
	}

	console.log(`  Maximum existing build for release "${release}" is "${maxVersion}".`);
	return maxVersion;

}

async function createRelease(newTag) {
	console.log(chalk.green(`  Creating release "${newTag}..."`));
	try {
		await gh.repos.createRelease({
			'owner': owner,
			'repo': repo,
			'tag_name': newTag,
			'name': newTag,
			'target_commitish': process.env.TRAVIS_COMMIT
		});
	} catch (e) {
		console.error(chalk.red(e));
		process.exitCode = 1;
	}
}

async function main() {

	console.log('Attempting to automatically tag BSI release...');

	const skipRelease = (process.env.TRAVIS_COMMIT_MESSAGE.toLowerCase().indexOf(skipReleaseFlag) > -1);
	if (skipRelease) {
		console.log(`  "${skipReleaseFlag}" present in commit message, aborting auto-tag.`);
		return;
	}

	const isTaggedCommit = (process.env.TRAVIS_TAG !== '');
	if (isTaggedCommit) {
		console.log('  Tagged commit, aborting auto-tag.');
		return;
	}

	const isPullRequest = (process.env.TRAVIS_PULL_REQUEST !== 'false');
	if (isPullRequest) {
		console.log('  Pull request, aborting auto-tag.');
		return;
	}

	const isFork = (process.env.TRAVIS_SECURE_ENV_VARS === 'false');
	if (isFork) {
		console.log('  Cannot publish from forks, aborting auto-tag.');
		return;
	}

	const branchName = process.env.TRAVIS_BRANCH;
	const isMaster = (branchName === 'master');

	let release;
	if (isMaster) {
		console.log('  Master branch detected.');
		release = await tryGetActiveDevelopmentRelease();
		if (release === null) {
			console.log('  Aborting auto-tag.');
			return;
		}
	} else {
		console.log(`  Branch detected: "${branchName}".`);
		if (!versionChecker.test(branchName)) {
			console.log(`  Branch name "${branchName}" not a valid version, aborting auto-tag.`);
			return;
		}
		release = branchName;
	}

	let maxVersion = await tryFindMaxVersion(release);
	if (maxVersion === null) {
		console.log('  Aborting auto-tag.');
		return;
	}

	const newTag = `v${release}-${++maxVersion}`;
	createRelease(newTag);

}

main();
