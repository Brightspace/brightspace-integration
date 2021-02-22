import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import { uglify } from 'rollup-plugin-uglify';
import autoprefixer from 'autoprefixer';

const jsConfig = {
	input: './js/bsi.js',
	plugins: [
		commonjs(),
		copy({
			targets: [
				{ src: 'node_modules/@brightspace-ui/core/components/icons/images', dest: './build' },
				{ src: 'email-icons', dest: './build/images' }
			]
		})
	],
	output: {
		file: './build/bsi.js',
		format: 'iife',
		name: 'BSI',
		plugins: [uglify()]
	}
};

const cssConfigs = [
	'./sass/bsi.scss',
	'./sass/datagrid/datagrid.scss',
	'./sass/homepages/homepages.scss'
].map((path) => {
	const name = path.substring(
		path.lastIndexOf('/') + 1,
		path.lastIndexOf('.')
	);
	return {
		input: path,
		plugins: [
			postcss({
				extract: true,
				minimize: true, /* uses cssnano */
				plugins: [autoprefixer()],
				use: [
					['sass', { outputStyle: 'expanded' }]
				]
			})
		],
		output: {
			file: `./build/${name}.css`
		}
	};
});

export default [jsConfig].concat(cssConfigs);
