
'use strict';

const cors = require('@koa/cors');

module.exports = {
	compatibility: 'auto',
	dedupe: true,
	hostname: 'localhost',
	middlewares: [
		cors({origin: '*'}),
		function rewrite(context, next) {
			if (context.url.startsWith('/bsi.') || context.url.startsWith('/datagrid.') || context.url.startsWith('/homepages.') || context.url.startsWith('/images/')) {
				context.url = '/build' + context.url;
			}
			return next();
		}
	],
	nodeResolve: true,
	port: 8080,
	preserveSymlinks: true,
	watch: true
};
