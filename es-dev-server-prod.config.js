
'use strict';

const cors = require('@koa/cors');

module.exports = {
	hostname: 'localhost',
	port: 8080,
	compatibility: 'none',
	dedupe: true,
	middlewares: [
		cors()
	],
	nodeResolve: false,
	rootDir: 'build',
	start: false,
	watch: false
};
