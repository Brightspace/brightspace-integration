
'use strict';

const cors = require('@koa/cors');

module.exports = {
	compatibility: 'auto',
	dedupe: true,
	hostname: process.env.npm_config_hostname || 'localhost',
	middlewares: [
		cors({ origin: '*' }),
		function rewrite(context, next) {
			if (context.url.startsWith('/bsi.') || context.url.startsWith('/datagrid.') || context.url.startsWith('/homepages.') || context.url.startsWith('/images/')) {
				context.url = '/build' + context.url;
			}
			return next();
		}
	],
	nodeResolve: true,
	plugins: [
		{
			transform(context) {
				// removing detection of "define" to avoid UMD time bomb with UMD FRAs
				if (context.path === '/node_modules/fastdom/fastdom.js' || context.path === '/node_modules/focus-visible/dist/focus-visible.js') {
					const transformedBody = context.body.replace(/\bdefine\b/g, 'defineNoYouDont');
					return { body: transformedBody };
				}
			}
		}
	],
	port: parseInt(process.env.npm_config_port) || 8080,
	preserveSymlinks: true
};
