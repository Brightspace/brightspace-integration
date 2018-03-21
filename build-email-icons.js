/* eslint no-console: "off" */

'use strict';

const fs = require('fs-extra');
const imagemin = require('imagemin');
const optipng = require('imagemin-optipng');
const svg2png = require('svg2png');

[
	'tier2/assignments',
	'tier2/quizzing',
	'tier2/media',
	'tier2/file-document',
	'tier2/file-image',
	'tier2/google-drive',
	'tier2/one-drive',
	'tier1/bullet'
].forEach(filePath =>
	fs.readFile(`bower_components/d2l-icons/images/${filePath}.svg`)
		.then(svg2png)
		.then(buffer => imagemin.buffer(buffer, { use: [optipng({ opimizationLevel: 7 })] }))
		.then(buffer => fs.outputFile(`build/images/email-icons/${filePath}.png`, buffer))
		.catch(e => {
			console.error(e);
			process.exit(1);
		})
);
